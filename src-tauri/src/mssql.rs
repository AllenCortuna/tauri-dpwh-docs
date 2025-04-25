use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tiberius::{AuthMethod, Client, Config, Query};
use tokio::net::TcpStream;
use tokio_util::compat::TokioAsyncWriteCompatExt;

#[derive(Debug, Serialize, Deserialize)]
pub struct QueryRequest {
    query: String,
    params: Option<Vec<String>>,
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
    tcp.set_nodelay(true)
        .map_err(|e| format!("TCP error: {}", e))?;

    let mut client = Client::connect(config, tcp.compat_write())
        .await
        .map_err(|e| format!("Client connection error: {}", e))?;

    // Execute the query
    let query_text = query_request.query.clone();
    let is_select = query_text.trim().to_lowercase().starts_with("select");

    let result = if let Some(params) = query_request.params {
        // Handle parameterized query
        let mut query = Query::new(&query_text);
        println!("Query parameters: {:?}", params); //debug
                                                    // Add parameters
        for param in params {
            query.bind(param);
        }
        // println!("Executing query: {:?}", query_text); //debug

        // Execute query with parameters
        let stream = query.query(&mut client).await.map_err(|e| {
            println!("Query execution error: {}", e);
            format!("Query execution error: {}", e)
        })?;

        // Process the results
        if is_select {
            // For SELECT queries, return rows
            stream
                .into_first_result()
                .await
                .map_err(|e| format!("Result processing error: {}", e))?
        } else {
            // For UPDATE/INSERT/DELETE queries, return empty result
            stream
                .into_results()
                .await
                .map_err(|e| format!("Result processing error: {}", e))?;
            Vec::new()
        }
    } else {
        // Original implementation for non-parameterized queries
        let stream = client
            .query(&query_text, &[])
            .await
            .map_err(|e| format!("Query execution error: {}", e))?;

        if is_select {
            stream
                .into_first_result()
                .await
                .map_err(|e| format!("Result processing error: {}", e))?
        } else {
            // For non-SELECT queries with no params
            stream
                .into_results()
                .await
                .map_err(|e| format!("Result processing error: {}", e))?;
            Vec::new()
        }
    };

    // Convert the results to a format that can be serialized to JSON
    let mut result_rows = Vec::new();
    for row in result {
        let mut row_map = HashMap::new();
        for (i, column) in row.columns().iter().enumerate() {
            let column_name = column.name().to_string();
            let value = match column.column_type() {
                tiberius::ColumnType::Int4 => {
                    match row.try_get::<i32, _>(i) {
                        Ok(Some(value)) => serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
                        _ => serde_json::Value::Null,
                    }
                },
                tiberius::ColumnType::Int8 => {
                    match row.try_get::<i64, _>(i) {
                        Ok(Some(value)) => serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
                        _ => serde_json::Value::Null,
                    }
                },
                _ => {
                    // Default string handling for other types
                    match row.try_get::<&str, _>(i) {
                        Ok(Some(value)) => serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
                        _ => serde_json::Value::Null,
                    }
                }
            };
            row_map.insert(column_name, value);
        }
        result_rows.push(row_map);
    }

    println!("Query result: {:?}", result_rows); //debug
    Ok(QueryResult { rows: result_rows })
}
