export const createContractTable = `
          CREATE TABLE IF NOT EXISTS contracts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            batch TEXT NOT NULL,
            year TEXT NOT NULL,
            posting TEXT NOT NULL,
            preBid TEXT NOT NULL,
            bidding TEXT NOT NULL,
            contractID TEXT NOT NULL UNIQUE,
            projectName TEXT NOT NULL,
            status TEXT NOT NULL,
            contractAmount TEXT,
            contractor TEXT,
            bidEvalStart TEXT,
            bidEvalEnd TEXT,
            postQualStart TEXT,
            postQualEnd TEXT,
            reso TEXT,
            noa TEXT,
            ntp TEXT,
            ntpRecieve TEXT,
            contractDate TEXT,
            lastUpdated TEXT NOT NULL
          );
        `;

export const createContractorsTable = `
        CREATE TABLE contractors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contractorName TEXT NOT NULL,
          address TEXT NOT NULL,
          email TEXT,
          amo TEXT,
          designation TEXT,
          tin TEXT,
          lastUpdated TEXT NOT NULL
        );
      `;
