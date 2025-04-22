import { NextResponse } from "next/server";
import sql from "mssql";
// Server=tcp:olsen.database.windows.net,1433;Initial Catalog=free-db;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication="Active Directory Default";
const dbConfig = {
  user: "tsa",
  password: "Olsen_@30",
  server: "olsen.database.windows.net",
  database: "free-db",
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 30,
    authentication: {
      type: "active-directory-default",
    },
  },
};

export const dynamic = "force-static";

export async function GET() {
  try {
    // await sql.connect('Server=localhost,1433;Database=database;User Id=username;Password=password;Encrypt=true')
    await sql.connect(dbConfig);
    // CREATE TABLE mytable (
    //   id INT PRIMARY KEY IDENTITY(1,1),
    //   name NVARCHAR(100) NULL,
    //   email NVARCHAR(100) NULL,
    //   created_at DATETIME DEFAULT GETDATE()
    // )

    //  INSERT INTO mytable (name, email) VALUES
    // ('John Doe', 'john@example.com'),
    // ('Jane Smith', 'jane@example.com'),
    // ('Bob Johnson', 'bob@example.com')
    const result = await sql.query(`
        SELECT * FROM mytable
    `);
    console.log(result);
    return NextResponse.json({ message: "Hello World", result });
  } catch (error) {
    console.error("Error in root API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
