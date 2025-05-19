use infra;
          CREATE TABLE contracts (
          id INT IDENTITY(1,1) PRIMARY KEY,
          batch NVARCHAR(255) NOT NULL,
          type NVARCHAR(MAX) NOT NULL DEFAULT 'infra',
          year NVARCHAR(255) NOT NULL,
          posting NVARCHAR(255) NOT NULL,
          preBid NVARCHAR(255) NOT NULL,
          bidding NVARCHAR(255) NOT NULL,
          contractID NVARCHAR(255) NOT NULL UNIQUE,
          projectName NVARCHAR(MAX) NOT NULL,
          status NVARCHAR(255) NOT NULL,
          contractAmount NVARCHAR(255),
          contractor NVARCHAR(255),
          bidEvalStart NVARCHAR(255),
          bidEvalEnd NVARCHAR(255),
          postQualStart NVARCHAR(255),
          postQualEnd NVARCHAR(255),
          reso NVARCHAR(255),
          noa NVARCHAR(255),
          ntp NVARCHAR(255),
          ntpRecieve NVARCHAR(255),
          contractDate NVARCHAR(255),
          lastUpdated NVARCHAR(255) NOT NULL DEFAULT CONVERT(NVARCHAR(255), GETDATE())
      );


      CREATE TABLE contractors (
          id INT IDENTITY(1,1) PRIMARY KEY,
          contractorName NVARCHAR(MAX),
          address NVARCHAR(MAX),
          email NVARCHAR(255),
          amo NVARCHAR(255),
          designation NVARCHAR(255),
          tin NVARCHAR(255),
          lastUpdated NVARCHAR(255) NOT NULL DEFAULT CONVERT(NVARCHAR(255), GETDATE())
      );

