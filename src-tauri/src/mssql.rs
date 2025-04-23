use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tiberius::{Client, Config, AuthMethod};
use tokio::net::TcpStream;
use tokio_util::compat::TokioAsyncWriteCompatExt;

#[derive(Debug, Serialize, Deserialize)]
pub struct QueryRequest {
    query: String,
}

#[derive(Debug, Serialize)]
pub struct QueryResult {
    rows: Vec<HashMap<String, serde_json::Value>>,
}

#[tauri::command]
pub async fn execute_mssql_query(query_request: QueryRequest) -> Result<QueryResult, String> {
    // Create connection configuration
    let mut config = Config::new();
    config.host("DESKTOP-16NDUR5");
    config.port(1433);
    config.database("infra");
    config.authentication(AuthMethod::sql_server("tsa", "12345678"));
    config.trust_cert(); // Equivalent to trustServerCertificate: true

    // Connect to the database
    let tcp = TcpStream::connect(config.get_addr())
        .await
        .map_err(|e| format!("Connection error: {}", e))?;
    tcp.set_nodelay(true).map_err(|e| format!("TCP error: {}", e))?;
    
    let mut client = Client::connect(config, tcp.compat_write())
        .await
        .map_err(|e| format!("Client connection error: {}", e))?;

    // Execute the query
    let query = query_request.query.clone();
    let stream = client
        .query(&query, &[])
        .await
        .map_err(|e| format!("Query execution error: {}", e))?;

    // Process the results
    let rows = stream
        .into_first_result()
        .await
        .map_err(|e| format!("Result processing error: {}", e))?;

    // Convert the results to a format that can be serialized to JSON
    let mut result_rows = Vec::new();
    for row in rows {
        let mut row_map = HashMap::new();
        for (i, column) in row.columns().iter().enumerate() {
            let column_name = column.name().to_string();
            let value = match row.try_get::<&str, _>(i) {
                Ok(Some(value)) => serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
                _ => serde_json::Value::Null,
            };
            row_map.insert(column_name, value);
        }
        result_rows.push(row_map);
    }

    Ok(QueryResult { rows: result_rows })
}