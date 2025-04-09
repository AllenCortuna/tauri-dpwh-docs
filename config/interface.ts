export interface Contract {
    batch: string;
    year: string; // Added year field
    posting: string;
    preBid: string;
    bidding: string;
    contractID: string;
    projectName: string;
    status?: string;
    contractAmount?: string;
    contractor?: string;
    bidEvalStart?: string;
    bidEvalEnd?: string;
    postQualStart?: string;
    postQualEnd?: string;
    reso?: string;
    noa?: string;
    ntp?: string;
    ntpRecieve?: string;
    contractDate?: string;
  }

  export interface ExcelRow {
    "Batch No.": string;
    "Year": string | number; // Modified to accept both string and number
    "Posting Date": string;
    "Pre-Bid Date": string;
    "Bidding Date": string;
    "Contract ID": string;
    "Project Name": string;
    "Contract Amount"?: string;
    "Contractor"?: string;
    "Bid Evaluation Start"?: string;
    "Bid Evaluation End"?: string;
    "Post-Qualification Start"?: string;
    "Post-Qualification End"?: string;
    "Resolution"?: string;
    "NOA"?: string;
    "NTP"?: string;
    "NTP Received"?: string;
    "Contract Signed"?: string;
  }