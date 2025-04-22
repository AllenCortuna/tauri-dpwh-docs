import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";

const dbConfig = {
    user: 'tsa',
    password: '12345678',
    server: 'DESKTOP-16NDUR5',
    database: 'infra',
    port: 1433,  
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS'
    },
    connectionTimeout: 30000,       // Increased timeout to 30 seconds
    requestTimeout: 30000
};

export const dynamic = "force-static";

export async function POST(req: NextRequest) {
  try {
    console.log("Connected to MSSQL");
    const data = await req.json();
    console.log("Received data:", data);
    await sql.connect(dbConfig);
    const result = await sql.query(data.query);
    console.log(result);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in root API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
