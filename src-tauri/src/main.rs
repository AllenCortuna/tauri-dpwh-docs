// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Add this to your imports
mod mssql;
use mssql::execute_mssql_query;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        // Add this line to register the command
        .invoke_handler(tauri::generate_handler![execute_mssql_query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
