import sql from 'mssql';

// SQL Server configuration
export const sqlConfig = {
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  server: 'your_server_address', // Can be IP address or hostname
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // For Azure
    trustServerCertificate: true // Change to false for production
  }
};

// Connect to database
export async function connectToDatabase() {
  try {
    await sql.connect(sqlConfig);
    return sql;
  } catch (error) {
    console.error('Error connecting to SQL Server:', error);
    throw error;
  }
}

// Execute query
export async function executeQuery(query: string, params: unknown[] = []) {
  try {
    const pool = await connectToDatabase();
    const request = pool.request();
    
    // Add parameters to request
    params.forEach((param, index) => {
      request.input(`param${index}`, param);
    });
    
    // Replace ? placeholders with @paramX
    const formattedQuery = query.replace(/\?/g, (_, i) => `@param${i}`);
    
    return await request.query(formattedQuery);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Select query
export async function selectQuery<T>(query: string, params: unknown[] = []): Promise<T[]> {
  try {
    const result = await executeQuery(query, params);
    return result.recordset as T[];
  } catch (error) {
    console.error('Error executing select query:', error);
    throw error;
  }
}