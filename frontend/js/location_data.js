// ============================================================
// PriceNest - Location Hierarchy Data (FIXED & EXPANDED)
// Country → State/Province → City/Town
// Area type is now user-selected, not baked into city labels
// ============================================================

const LOCATION_DATA = {
  "IN": {
    name: "India", currency: "INR", symbol: "₹", rate: 83.5,
    states: {
      "AP": {
        name: "Andhra Pradesh",
        regions: [
          { name: "Visakhapatnam", pinPrefixes: ["530"] },
          { name: "Vijayawada", pinPrefixes: ["520"] },
          { name: "Guntur", pinPrefixes: ["522"] },
          { name: "Tirupati", pinPrefixes: ["517"] },
          { name: "Nellore", pinPrefixes: ["524"] },
          { name: "Kurnool", pinPrefixes: ["518"] },
          { name: "Kakinada", pinPrefixes: ["533"] },
          { name: "Rajahmundry", pinPrefixes: ["533"] },
          { name: "Eluru", pinPrefixes: ["534"] },
          { name: "Ongole", pinPrefixes: ["523"] }
        ]
      },
      "AR": {
        name: "Arunachal Pradesh",
        regions: [
          { name: "Itanagar", pinPrefixes: ["791"] },
          { name: "Naharlagun", pinPrefixes: ["791"] },
          { name: "Pasighat", pinPrefixes: ["791"] }
        ]
      },
      "AS": {
        name: "Assam",
        regions: [
          { name: "Guwahati", pinPrefixes: ["781"] },
          { name: "Dibrugarh", pinPrefixes: ["786"] },
          { name: "Silchar", pinPrefixes: ["788"] },
          { name: "Jorhat", pinPrefixes: ["785"] },
          { name: "Nagaon", pinPrefixes: ["782"] },
          { name: "Tinsukia", pinPrefixes: ["786"] }
        ]
      },
      "BR": {
        name: "Bihar",
        regions: [
          { name: "Patna", pinPrefixes: ["800"] },
          { name: "Gaya", pinPrefixes: ["823"] },
          { name: "Bhagalpur", pinPrefixes: ["812"] },
          { name: "Muzaffarpur", pinPrefixes: ["842"] },
          { name: "Darbhanga", pinPrefixes: ["846"] },
          { name: "Purnea", pinPrefixes: ["854"] },
          { name: "Ara", pinPrefixes: ["802"] },
          { name: "Begusarai", pinPrefixes: ["851"] }
        ]
      },
      "CG": {
        name: "Chhattisgarh",
        regions: [
          { name: "Raipur", pinPrefixes: ["492"] },
          { name: "Bhilai", pinPrefixes: ["490"] },
          { name: "Bilaspur", pinPrefixes: ["495"] },
          { name: "Durg", pinPrefixes: ["491"] },
          { name: "Korba", pinPrefixes: ["495"] },
          { name: "Rajnandgaon", pinPrefixes: ["491"] }
        ]
      },
      "DL": {
        name: "Delhi (NCT)",
        regions: [
          { name: "Connaught Place", pinPrefixes: ["110001"] },
          { name: "New Delhi (Central)", pinPrefixes: ["110001", "110002", "110003"] },
          { name: "South Delhi", pinPrefixes: ["110017", "110016", "110048", "110049", "110065"] },
          { name: "South West Delhi", pinPrefixes: ["110037", "110045", "110046", "110047"] },
          { name: "West Delhi", pinPrefixes: ["110018", "110026", "110027", "110041", "110063"] },
          { name: "North Delhi", pinPrefixes: ["110007", "110006", "110054", "110060"] },
          { name: "North West Delhi", pinPrefixes: ["110034", "110035", "110052"] },
          { name: "East Delhi", pinPrefixes: ["110091", "110092", "110093", "110096"] },
          { name: "North East Delhi", pinPrefixes: ["110093", "110094", "110095"] },
          { name: "Dwarka (Sector 1-13)", pinPrefixes: ["110075", "110077", "110078"] },
          { name: "Dwarka (Sector 14-23)", pinPrefixes: ["110075", "110076"] },
          { name: "Rohini", pinPrefixes: ["110085", "110086"] },
          { name: "Pitampura", pinPrefixes: ["110034", "110088"] },
          { name: "Janakpuri", pinPrefixes: ["110058"] },
          { name: "Laxmi Nagar", pinPrefixes: ["110092"] },
          { name: "Mayur Vihar", pinPrefixes: ["110091", "110096"] },
          { name: "Noida Extension (NCR)", pinPrefixes: ["201301", "201304"] },
          { name: "Shahdara", pinPrefixes: ["110032", "110051"] },
          { name: "Uttam Nagar", pinPrefixes: ["110059"] },
          { name: "Najafgarh", pinPrefixes: ["110043"] },
          { name: "Narela", pinPrefixes: ["110040"] },
          { name: "Mehrauli", pinPrefixes: ["110030"] },
          { name: "Vasant Kunj", pinPrefixes: ["110070"] },
          { name: "Saket", pinPrefixes: ["110017"] },
          { name: "Hauz Khas", pinPrefixes: ["110016"] },
          { name: "Greater Kailash", pinPrefixes: ["110048"] },
          { name: "Lajpat Nagar", pinPrefixes: ["110024"] },
          { name: "Karol Bagh", pinPrefixes: ["110005"] },
          { name: "Patel Nagar", pinPrefixes: ["110008"] }
        ]
      },
      "GA": {
        name: "Goa",
        regions: [
          { name: "Panaji", pinPrefixes: ["403"] },
          { name: "Margao", pinPrefixes: ["403"] },
          { name: "Vasco da Gama", pinPrefixes: ["403"] },
          { name: "Mapusa", pinPrefixes: ["403"] },
          { name: "Calangute", pinPrefixes: ["403"] }
        ]
      },
      "GJ": {
        name: "Gujarat",
        regions: [
          { name: "Ahmedabad", pinPrefixes: ["380"] },
          { name: "Surat", pinPrefixes: ["395"] },
          { name: "Vadodara", pinPrefixes: ["390"] },
          { name: "Rajkot", pinPrefixes: ["360"] },
          { name: "Gandhinagar", pinPrefixes: ["382"] },
          { name: "Bhavnagar", pinPrefixes: ["364"] },
          { name: "Jamnagar", pinPrefixes: ["361"] },
          { name: "Junagadh", pinPrefixes: ["362"] },
          { name: "Anand", pinPrefixes: ["388"] },
          { name: "Mehsana", pinPrefixes: ["384"] },
          { name: "Navsari", pinPrefixes: ["396"] },
          { name: "Valsad", pinPrefixes: ["396"] }
        ]
      },
      "HR": {
        name: "Haryana",
        regions: [
          { name: "Gurugram", pinPrefixes: ["122"] },
          { name: "Faridabad", pinPrefixes: ["121"] },
          { name: "Panipat", pinPrefixes: ["132"] },
          { name: "Ambala", pinPrefixes: ["134"] },
          { name: "Karnal", pinPrefixes: ["132"] },
          { name: "Rohtak", pinPrefixes: ["124"] },
          { name: "Hisar", pinPrefixes: ["125"] },
          { name: "Sonipat", pinPrefixes: ["131"] },
          { name: "Yamunanagar", pinPrefixes: ["135"] },
          { name: "Panchkula", pinPrefixes: ["134"] }
        ]
      },
      "HP": {
        name: "Himachal Pradesh",
        regions: [
          { name: "Shimla", pinPrefixes: ["171"] },
          { name: "Manali", pinPrefixes: ["175"] },
          { name: "Dharamshala", pinPrefixes: ["176"] },
          { name: "Mandi", pinPrefixes: ["175"] },
          { name: "Solan", pinPrefixes: ["173"] },
          { name: "Kullu", pinPrefixes: ["175"] }
        ]
      },
      "JH": {
        name: "Jharkhand",
        regions: [
          { name: "Ranchi", pinPrefixes: ["834"] },
          { name: "Jamshedpur", pinPrefixes: ["831"] },
          { name: "Dhanbad", pinPrefixes: ["826"] },
          { name: "Bokaro", pinPrefixes: ["827"] },
          { name: "Deoghar", pinPrefixes: ["814"] },
          { name: "Hazaribagh", pinPrefixes: ["825"] }
        ]
      },
      "KA": {
        name: "Karnataka",
        regions: [
          { name: "Bengaluru (Urban)", pinPrefixes: ["560"] },
          { name: "Bengaluru South", pinPrefixes: ["560068", "560076", "560078"] },
          { name: "Bengaluru North", pinPrefixes: ["560045", "560064"] },
          { name: "Bengaluru East", pinPrefixes: ["560037", "560038", "560049"] },
          { name: "Mysuru", pinPrefixes: ["570"] },
          { name: "Mangaluru", pinPrefixes: ["575"] },
          { name: "Hubballi", pinPrefixes: ["580"] },
          { name: "Belagavi", pinPrefixes: ["590"] },
          { name: "Kalaburagi", pinPrefixes: ["585"] },
          { name: "Davangere", pinPrefixes: ["577"] },
          { name: "Tumakuru", pinPrefixes: ["572"] },
          { name: "Shivamogga", pinPrefixes: ["577"] },
          { name: "Udupi", pinPrefixes: ["576"] },
          { name: "Vijayapura", pinPrefixes: ["586"] }
        ]
      },
      "KL": {
        name: "Kerala",
        regions: [
          { name: "Thiruvananthapuram", pinPrefixes: ["695"] },
          { name: "Kochi (Ernakulam)", pinPrefixes: ["682"] },
          { name: "Kozhikode", pinPrefixes: ["673"] },
          { name: "Thrissur", pinPrefixes: ["680"] },
          { name: "Kannur", pinPrefixes: ["670"] },
          { name: "Kollam", pinPrefixes: ["691"] },
          { name: "Palakkad", pinPrefixes: ["678"] },
          { name: "Malappuram", pinPrefixes: ["676"] },
          { name: "Alappuzha", pinPrefixes: ["688"] }
        ]
      },
      "MP": {
        name: "Madhya Pradesh",
        regions: [
          { name: "Bhopal", pinPrefixes: ["462"] },
          { name: "Indore", pinPrefixes: ["452"] },
          { name: "Jabalpur", pinPrefixes: ["482"] },
          { name: "Gwalior", pinPrefixes: ["474"] },
          { name: "Ujjain", pinPrefixes: ["456"] },
          { name: "Sagar", pinPrefixes: ["470"] },
          { name: "Dewas", pinPrefixes: ["455"] },
          { name: "Satna", pinPrefixes: ["485"] }
        ]
      },
      "MH": {
        name: "Maharashtra",
        regions: [
          { name: "Mumbai (South)", pinPrefixes: ["400001", "400002", "400003", "400004", "400005"] },
          { name: "Mumbai (Central)", pinPrefixes: ["400008", "400010", "400011"] },
          { name: "Mumbai (Western Suburbs)", pinPrefixes: ["400050", "400053", "400054", "400058", "400063"] },
          { name: "Mumbai (Eastern Suburbs)", pinPrefixes: ["400071", "400074", "400079", "400083", "400088"] },
          { name: "Navi Mumbai", pinPrefixes: ["400703", "400706", "400710"] },
          { name: "Thane", pinPrefixes: ["400601", "400602", "400603"] },
          { name: "Pune", pinPrefixes: ["411"] },
          { name: "Pune (Hinjawadi / IT)", pinPrefixes: ["411057", "411027"] },
          { name: "Nagpur", pinPrefixes: ["440"] },
          { name: "Nashik", pinPrefixes: ["422"] },
          { name: "Aurangabad", pinPrefixes: ["431"] },
          { name: "Solapur", pinPrefixes: ["413"] },
          { name: "Kolhapur", pinPrefixes: ["416"] },
          { name: "Ahmednagar", pinPrefixes: ["414"] },
          { name: "Satara", pinPrefixes: ["415"] }
        ]
      },
      "MN": {
        name: "Manipur",
        regions: [
          { name: "Imphal", pinPrefixes: ["795"] },
          { name: "Thoubal", pinPrefixes: ["795"] }
        ]
      },
      "ML": {
        name: "Meghalaya",
        regions: [
          { name: "Shillong", pinPrefixes: ["793"] },
          { name: "Tura", pinPrefixes: ["794"] }
        ]
      },
      "MZ": {
        name: "Mizoram",
        regions: [
          { name: "Aizawl", pinPrefixes: ["796"] },
          { name: "Lunglei", pinPrefixes: ["796"] }
        ]
      },
      "NL": {
        name: "Nagaland",
        regions: [
          { name: "Kohima", pinPrefixes: ["797"] },
          { name: "Dimapur", pinPrefixes: ["797"] }
        ]
      },
      "OD": {
        name: "Odisha",
        regions: [
          { name: "Bhubaneswar", pinPrefixes: ["751"] },
          { name: "Cuttack", pinPrefixes: ["753"] },
          { name: "Rourkela", pinPrefixes: ["769"] },
          { name: "Berhampur", pinPrefixes: ["760"] },
          { name: "Sambalpur", pinPrefixes: ["768"] },
          { name: "Puri", pinPrefixes: ["752"] }
        ]
      },
      "PB": {
        name: "Punjab",
        regions: [
          { name: "Ludhiana", pinPrefixes: ["141"] },
          { name: "Amritsar", pinPrefixes: ["143"] },
          { name: "Jalandhar", pinPrefixes: ["144"] },
          { name: "Patiala", pinPrefixes: ["147"] },
          { name: "Bathinda", pinPrefixes: ["151"] },
          { name: "Mohali (SAS Nagar)", pinPrefixes: ["160"] },
          { name: "Pathankot", pinPrefixes: ["145"] },
          { name: "Hoshiarpur", pinPrefixes: ["146"] }
        ]
      },
      "RJ": {
        name: "Rajasthan",
        regions: [
          { name: "Jaipur", pinPrefixes: ["302"] },
          { name: "Jodhpur", pinPrefixes: ["342"] },
          { name: "Kota", pinPrefixes: ["324"] },
          { name: "Ajmer", pinPrefixes: ["305"] },
          { name: "Bikaner", pinPrefixes: ["334"] },
          { name: "Udaipur", pinPrefixes: ["313"] },
          { name: "Alwar", pinPrefixes: ["301"] },
          { name: "Bhilwara", pinPrefixes: ["311"] },
          { name: "Sikar", pinPrefixes: ["332"] },
          { name: "Barmer", pinPrefixes: ["344"] },
          { name: "Jaisalmer", pinPrefixes: ["345"] },
          { name: "Tonk", pinPrefixes: ["304"] }
        ]
      },
      "SK": {
        name: "Sikkim",
        regions: [
          { name: "Gangtok", pinPrefixes: ["737"] },
          { name: "Namchi", pinPrefixes: ["737"] }
        ]
      },
      "TN": {
        name: "Tamil Nadu",
        regions: [
          { name: "Chennai", pinPrefixes: ["600"] },
          { name: "Chennai (Anna Nagar)", pinPrefixes: ["600040"] },
          { name: "Chennai (T Nagar)", pinPrefixes: ["600017"] },
          { name: "Coimbatore", pinPrefixes: ["641"] },
          { name: "Madurai", pinPrefixes: ["625"] },
          { name: "Tiruchirappalli", pinPrefixes: ["620"] },
          { name: "Salem", pinPrefixes: ["636"] },
          { name: "Tirunelveli", pinPrefixes: ["627"] },
          { name: "Erode", pinPrefixes: ["638"] },
          { name: "Tiruppur", pinPrefixes: ["641"] },
          { name: "Vellore", pinPrefixes: ["632"] },
          { name: "Thanjavur", pinPrefixes: ["613"] },
          { name: "Dindigul", pinPrefixes: ["624"] },
          { name: "Kancheepuram", pinPrefixes: ["631"] }
        ]
      },
      "TS": {
        name: "Telangana",
        regions: [
          { name: "Hyderabad", pinPrefixes: ["500"] },
          { name: "Hyderabad (Hitech City)", pinPrefixes: ["500081", "500084", "500089"] },
          { name: "Secunderabad", pinPrefixes: ["500"] },
          { name: "Warangal", pinPrefixes: ["506"] },
          { name: "Nizamabad", pinPrefixes: ["503"] },
          { name: "Karimnagar", pinPrefixes: ["505"] },
          { name: "Khammam", pinPrefixes: ["507"] }
        ]
      },
      "TR": {
        name: "Tripura",
        regions: [
          { name: "Agartala", pinPrefixes: ["799"] },
          { name: "Dharmanagar", pinPrefixes: ["799"] }
        ]
      },
      "UP": {
        name: "Uttar Pradesh",
        regions: [
          { name: "Lucknow", pinPrefixes: ["226"] },
          { name: "Kanpur", pinPrefixes: ["208"] },
          { name: "Varanasi", pinPrefixes: ["221"] },
          { name: "Agra", pinPrefixes: ["282"] },
          { name: "Prayagraj", pinPrefixes: ["211"] },
          { name: "Meerut", pinPrefixes: ["250"] },
          { name: "Noida", pinPrefixes: ["201"] },
          { name: "Greater Noida", pinPrefixes: ["201301", "201306", "201310"] },
          { name: "Ghaziabad", pinPrefixes: ["201"] },
          { name: "Gorakhpur", pinPrefixes: ["273"] },
          { name: "Bareilly", pinPrefixes: ["243"] },
          { name: "Aligarh", pinPrefixes: ["202"] },
          { name: "Moradabad", pinPrefixes: ["244"] },
          { name: "Saharanpur", pinPrefixes: ["247"] },
          { name: "Mathura", pinPrefixes: ["281"] },
          { name: "Vrindavan", pinPrefixes: ["281"] }
        ]
      },
      "UK": {
        name: "Uttarakhand",
        regions: [
          { name: "Dehradun", pinPrefixes: ["248"] },
          { name: "Haridwar", pinPrefixes: ["249"] },
          { name: "Roorkee", pinPrefixes: ["247"] },
          { name: "Nainital", pinPrefixes: ["263"] },
          { name: "Haldwani", pinPrefixes: ["263"] },
          { name: "Mussoorie", pinPrefixes: ["248"] }
        ]
      },
      "WB": {
        name: "West Bengal",
        regions: [
          { name: "Kolkata", pinPrefixes: ["700"] },
          { name: "Kolkata (Salt Lake)", pinPrefixes: ["700091", "700064", "700097"] },
          { name: "Howrah", pinPrefixes: ["711"] },
          { name: "Durgapur", pinPrefixes: ["713"] },
          { name: "Asansol", pinPrefixes: ["713"] },
          { name: "Siliguri", pinPrefixes: ["734"] },
          { name: "Bardhaman", pinPrefixes: ["713"] },
          { name: "Midnapore", pinPrefixes: ["721"] },
          { name: "Raiganj", pinPrefixes: ["733"] },
          { name: "Malda", pinPrefixes: ["732"] }
        ]
      }
    }
  },
  "US": {
    name: "United States", currency: "USD", symbol: "$", rate: 1,
    states: {
      "CA": {
        name: "California",
        regions: [
          { name: "Los Angeles", pinPrefixes: ["900"] },
          { name: "San Francisco", pinPrefixes: ["941"] },
          { name: "San Diego", pinPrefixes: ["921"] },
          { name: "San Jose", pinPrefixes: ["951"] },
          { name: "Sacramento", pinPrefixes: ["958"] },
          { name: "Fresno", pinPrefixes: ["937"] },
          { name: "Bakersfield", pinPrefixes: ["933"] },
          { name: "Modesto", pinPrefixes: ["953"] },
          { name: "Riverside", pinPrefixes: ["925"] },
          { name: "Stockton", pinPrefixes: ["952"] },
          { name: "Eureka", pinPrefixes: ["955"] },
          { name: "Bishop", pinPrefixes: ["935"] }
        ]
      },
      "TX": {
        name: "Texas",
        regions: [
          { name: "Houston", pinPrefixes: ["770"] },
          { name: "Dallas", pinPrefixes: ["752"] },
          { name: "Austin", pinPrefixes: ["787"] },
          { name: "San Antonio", pinPrefixes: ["782"] },
          { name: "Fort Worth", pinPrefixes: ["761"] },
          { name: "El Paso", pinPrefixes: ["799"] },
          { name: "Arlington", pinPrefixes: ["760"] },
          { name: "Corpus Christi", pinPrefixes: ["784"] },
          { name: "Lubbock", pinPrefixes: ["794"] },
          { name: "Amarillo", pinPrefixes: ["791"] },
          { name: "Midland", pinPrefixes: ["797"] }
        ]
      },
      "NY": {
        name: "New York",
        regions: [
          { name: "New York City", pinPrefixes: ["100"] },
          { name: "Buffalo", pinPrefixes: ["142"] },
          { name: "Rochester", pinPrefixes: ["146"] },
          { name: "Yonkers", pinPrefixes: ["107"] },
          { name: "Syracuse", pinPrefixes: ["132"] },
          { name: "Albany", pinPrefixes: ["122"] },
          { name: "New Rochelle", pinPrefixes: ["108"] },
          { name: "Saratoga Springs", pinPrefixes: ["128"] },
          { name: "Ithaca", pinPrefixes: ["148"] }
        ]
      },
      "FL": {
        name: "Florida",
        regions: [
          { name: "Miami", pinPrefixes: ["331"] },
          { name: "Orlando", pinPrefixes: ["328"] },
          { name: "Tampa", pinPrefixes: ["336"] },
          { name: "Jacksonville", pinPrefixes: ["322"] },
          { name: "St. Petersburg", pinPrefixes: ["337"] },
          { name: "Fort Lauderdale", pinPrefixes: ["333"] },
          { name: "Tallahassee", pinPrefixes: ["323"] },
          { name: "Gainesville", pinPrefixes: ["326"] },
          { name: "Naples", pinPrefixes: ["341"] },
          { name: "Key West", pinPrefixes: ["330"] }
        ]
      },
      "WA": {
        name: "Washington",
        regions: [
          { name: "Seattle", pinPrefixes: ["981"] },
          { name: "Spokane", pinPrefixes: ["992"] },
          { name: "Tacoma", pinPrefixes: ["984"] },
          { name: "Bellevue", pinPrefixes: ["980"] },
          { name: "Olympia", pinPrefixes: ["985"] },
          { name: "Yakima", pinPrefixes: ["989"] },
          { name: "Walla Walla", pinPrefixes: ["993"] }
        ]
      },
      "IL": {
        name: "Illinois",
        regions: [
          { name: "Chicago", pinPrefixes: ["606"] },
          { name: "Aurora", pinPrefixes: ["605"] },
          { name: "Naperville", pinPrefixes: ["605"] },
          { name: "Joliet", pinPrefixes: ["604"] },
          { name: "Springfield", pinPrefixes: ["627"] },
          { name: "Rockford", pinPrefixes: ["610"] },
          { name: "Peoria", pinPrefixes: ["616"] },
          { name: "Champaign", pinPrefixes: ["618"] }
        ]
      },
      "GA": {
        name: "Georgia",
        regions: [
          { name: "Atlanta", pinPrefixes: ["303"] },
          { name: "Augusta", pinPrefixes: ["309"] },
          { name: "Savannah", pinPrefixes: ["314"] },
          { name: "Columbus", pinPrefixes: ["319"] },
          { name: "Macon", pinPrefixes: ["312"] }
        ]
      },
      "AZ": {
        name: "Arizona",
        regions: [
          { name: "Phoenix", pinPrefixes: ["850"] },
          { name: "Tucson", pinPrefixes: ["857"] },
          { name: "Mesa", pinPrefixes: ["852"] },
          { name: "Scottsdale", pinPrefixes: ["852"] },
          { name: "Flagstaff", pinPrefixes: ["860"] }
        ]
      },
      "CO": {
        name: "Colorado",
        regions: [
          { name: "Denver", pinPrefixes: ["802"] },
          { name: "Colorado Springs", pinPrefixes: ["809"] },
          { name: "Aurora", pinPrefixes: ["800"] },
          { name: "Boulder", pinPrefixes: ["803"] },
          { name: "Fort Collins", pinPrefixes: ["805"] }
        ]
      },
      "MA": {
        name: "Massachusetts",
        regions: [
          { name: "Boston", pinPrefixes: ["021"] },
          { name: "Worcester", pinPrefixes: ["016"] },
          { name: "Cambridge", pinPrefixes: ["021"] },
          { name: "Springfield", pinPrefixes: ["011"] },
          { name: "Lowell", pinPrefixes: ["018"] }
        ]
      },
      "OH": {
        name: "Ohio",
        regions: [
          { name: "Columbus", pinPrefixes: ["432"] },
          { name: "Cleveland", pinPrefixes: ["441"] },
          { name: "Cincinnati", pinPrefixes: ["452"] },
          { name: "Toledo", pinPrefixes: ["436"] },
          { name: "Akron", pinPrefixes: ["443"] }
        ]
      },
      "PA": {
        name: "Pennsylvania",
        regions: [
          { name: "Philadelphia", pinPrefixes: ["191"] },
          { name: "Pittsburgh", pinPrefixes: ["152"] },
          { name: "Allentown", pinPrefixes: ["181"] },
          { name: "Erie", pinPrefixes: ["165"] },
          { name: "Harrisburg", pinPrefixes: ["171"] }
        ]
      }
    }
  },
  "GB": {
    name: "United Kingdom", currency: "GBP", symbol: "£", rate: 0.79,
    states: {
      "ENG-LON": {
        name: "London",
        regions: [
          { name: "City of London", pinPrefixes: ["EC"] },
          { name: "Westminster", pinPrefixes: ["SW1"] },
          { name: "Kensington & Chelsea", pinPrefixes: ["W8"] },
          { name: "Tower Hamlets", pinPrefixes: ["E1"] },
          { name: "Southwark", pinPrefixes: ["SE1"] },
          { name: "Camden", pinPrefixes: ["NW1"] },
          { name: "Hackney", pinPrefixes: ["E8"] },
          { name: "Croydon", pinPrefixes: ["CR0"] },
          { name: "Bromley", pinPrefixes: ["BR1"] }
        ]
      },
      "ENG-SE": {
        name: "South East England",
        regions: [
          { name: "Brighton", pinPrefixes: ["BN"] },
          { name: "Southampton", pinPrefixes: ["SO"] },
          { name: "Oxford", pinPrefixes: ["OX"] },
          { name: "Reading", pinPrefixes: ["RG"] },
          { name: "Guildford", pinPrefixes: ["GU"] },
          { name: "Canterbury", pinPrefixes: ["CT"] },
          { name: "Tunbridge Wells", pinPrefixes: ["TN"] },
          { name: "Chichester", pinPrefixes: ["PO"] }
        ]
      },
      "ENG-NW": {
        name: "North West England",
        regions: [
          { name: "Manchester", pinPrefixes: ["M"] },
          { name: "Liverpool", pinPrefixes: ["L"] },
          { name: "Salford", pinPrefixes: ["M3"] },
          { name: "Preston", pinPrefixes: ["PR"] },
          { name: "Blackpool", pinPrefixes: ["FY"] }
        ]
      },
      "SCT": {
        name: "Scotland",
        regions: [
          { name: "Edinburgh", pinPrefixes: ["EH"] },
          { name: "Glasgow", pinPrefixes: ["G"] },
          { name: "Aberdeen", pinPrefixes: ["AB"] },
          { name: "Dundee", pinPrefixes: ["DD"] },
          { name: "Inverness", pinPrefixes: ["IV"] },
          { name: "Fort William", pinPrefixes: ["PH"] }
        ]
      },
      "WLS": {
        name: "Wales",
        regions: [
          { name: "Cardiff", pinPrefixes: ["CF"] },
          { name: "Swansea", pinPrefixes: ["SA"] },
          { name: "Newport", pinPrefixes: ["NP"] },
          { name: "Wrexham", pinPrefixes: ["LL"] }
        ]
      }
    }
  },
  "CN": {
    name: "China", currency: "CNY", symbol: "¥", rate: 7.24,
    states: {
      "BJ": {
        name: "Beijing",
        regions: [
          { name: "Chaoyang", pinPrefixes: ["100"] },
          { name: "Haidian", pinPrefixes: ["100"] },
          { name: "Dongcheng", pinPrefixes: ["100"] },
          { name: "Shunyi", pinPrefixes: ["101"] },
          { name: "Tongzhou", pinPrefixes: ["101"] },
          { name: "Yanqing", pinPrefixes: ["102"] }
        ]
      },
      "SH": {
        name: "Shanghai",
        regions: [
          { name: "Pudong", pinPrefixes: ["200"] },
          { name: "Huangpu", pinPrefixes: ["200"] },
          { name: "Jing'an", pinPrefixes: ["200"] },
          { name: "Minhang", pinPrefixes: ["201"] },
          { name: "Jiading", pinPrefixes: ["201"] },
          { name: "Chongming", pinPrefixes: ["202"] }
        ]
      },
      "GD": {
        name: "Guangdong",
        regions: [
          { name: "Guangzhou", pinPrefixes: ["510"] },
          { name: "Shenzhen", pinPrefixes: ["518"] },
          { name: "Dongguan", pinPrefixes: ["523"] },
          { name: "Foshan", pinPrefixes: ["528"] },
          { name: "Zhuhai", pinPrefixes: ["519"] }
        ]
      }
    }
  },
  "JP": {
    name: "Japan", currency: "JPY", symbol: "¥", rate: 149.5,
    states: {
      "TK": {
        name: "Tokyo",
        regions: [
          { name: "Shinjuku", pinPrefixes: ["160"] },
          { name: "Shibuya", pinPrefixes: ["150"] },
          { name: "Minato", pinPrefixes: ["105"] },
          { name: "Chiyoda", pinPrefixes: ["100"] },
          { name: "Hachioji", pinPrefixes: ["192"] },
          { name: "Tama", pinPrefixes: ["206"] }
        ]
      },
      "OS": {
        name: "Osaka",
        regions: [
          { name: "Namba/Chuo", pinPrefixes: ["542"] },
          { name: "Umeda/Kita", pinPrefixes: ["530"] },
          { name: "Sakai", pinPrefixes: ["590"] },
          { name: "Higashiosaka", pinPrefixes: ["577"] },
          { name: "Kishiwada", pinPrefixes: ["596"] }
        ]
      },
      "KN": {
        name: "Kanagawa",
        regions: [
          { name: "Yokohama", pinPrefixes: ["220"] },
          { name: "Kawasaki", pinPrefixes: ["210"] },
          { name: "Kamakura", pinPrefixes: ["247"] },
          { name: "Hakone", pinPrefixes: ["250"] }
        ]
      }
    }
  },
  "DE": {
    name: "Germany", currency: "EUR", symbol: "€", rate: 0.92,
    states: {
      "BE": {
        name: "Berlin",
        regions: [
          { name: "Mitte", pinPrefixes: ["10"] },
          { name: "Prenzlauer Berg", pinPrefixes: ["10"] },
          { name: "Kreuzberg", pinPrefixes: ["10"] },
          { name: "Spandau", pinPrefixes: ["13"] },
          { name: "Köpenick", pinPrefixes: ["12"] }
        ]
      },
      "BY": {
        name: "Bavaria",
        regions: [
          { name: "Munich", pinPrefixes: ["80"] },
          { name: "Nuremberg", pinPrefixes: ["90"] },
          { name: "Augsburg", pinPrefixes: ["86"] },
          { name: "Regensburg", pinPrefixes: ["93"] },
          { name: "Würzburg", pinPrefixes: ["97"] },
          { name: "Bayreuth", pinPrefixes: ["95"] }
        ]
      },
      "NW": {
        name: "North Rhine-Westphalia",
        regions: [
          { name: "Cologne", pinPrefixes: ["50"] },
          { name: "Düsseldorf", pinPrefixes: ["40"] },
          { name: "Dortmund", pinPrefixes: ["44"] },
          { name: "Essen", pinPrefixes: ["45"] },
          { name: "Bonn", pinPrefixes: ["53"] },
          { name: "Münster", pinPrefixes: ["48"] }
        ]
      },
      "HH": {
        name: "Hamburg",
        regions: [
          { name: "Hamburg (City)", pinPrefixes: ["20"] },
          { name: "Hamburg Altona", pinPrefixes: ["22"] },
          { name: "Hamburg Nord", pinPrefixes: ["22"] }
        ]
      }
    }
  },
  "FR": {
    name: "France", currency: "EUR", symbol: "€", rate: 0.92,
    states: {
      "IDF": {
        name: "Île-de-France",
        regions: [
          { name: "Paris (1st–8th)", pinPrefixes: ["750"] },
          { name: "Paris (9th–20th)", pinPrefixes: ["750"] },
          { name: "Versailles", pinPrefixes: ["781"] },
          { name: "Boulogne-Billancourt", pinPrefixes: ["921"] },
          { name: "Meaux", pinPrefixes: ["774"] }
        ]
      },
      "PAC": {
        name: "Provence-Alpes-Côte d'Azur",
        regions: [
          { name: "Marseille", pinPrefixes: ["130"] },
          { name: "Nice", pinPrefixes: ["060"] },
          { name: "Toulon", pinPrefixes: ["830"] },
          { name: "Aix-en-Provence", pinPrefixes: ["13100"] },
          { name: "Cannes", pinPrefixes: ["06400"] }
        ]
      },
      "ARA": {
        name: "Auvergne-Rhône-Alpes",
        regions: [
          { name: "Lyon", pinPrefixes: ["690"] },
          { name: "Grenoble", pinPrefixes: ["380"] },
          { name: "Saint-Étienne", pinPrefixes: ["420"] },
          { name: "Clermont-Ferrand", pinPrefixes: ["630"] }
        ]
      }
    }
  },
  "AU": {
    name: "Australia", currency: "AUD", symbol: "A$", rate: 1.53,
    states: {
      "NSW": {
        name: "New South Wales",
        regions: [
          { name: "Sydney CBD", pinPrefixes: ["2000"] },
          { name: "Parramatta", pinPrefixes: ["2150"] },
          { name: "Newcastle", pinPrefixes: ["2300"] },
          { name: "Wollongong", pinPrefixes: ["2500"] },
          { name: "Central Coast", pinPrefixes: ["2250"] },
          { name: "Orange", pinPrefixes: ["2800"] },
          { name: "Dubbo", pinPrefixes: ["2830"] }
        ]
      },
      "VIC": {
        name: "Victoria",
        regions: [
          { name: "Melbourne CBD", pinPrefixes: ["3000"] },
          { name: "Geelong", pinPrefixes: ["3220"] },
          { name: "Ballarat", pinPrefixes: ["3350"] },
          { name: "Bendigo", pinPrefixes: ["3550"] },
          { name: "Shepparton", pinPrefixes: ["3630"] },
          { name: "Warrnambool", pinPrefixes: ["3280"] }
        ]
      },
      "QLD": {
        name: "Queensland",
        regions: [
          { name: "Brisbane", pinPrefixes: ["4000"] },
          { name: "Gold Coast", pinPrefixes: ["4217"] },
          { name: "Sunshine Coast", pinPrefixes: ["4558"] },
          { name: "Townsville", pinPrefixes: ["4810"] },
          { name: "Cairns", pinPrefixes: ["4870"] },
          { name: "Toowoomba", pinPrefixes: ["4350"] }
        ]
      },
      "WA": {
        name: "Western Australia",
        regions: [
          { name: "Perth", pinPrefixes: ["6000"] },
          { name: "Fremantle", pinPrefixes: ["6160"] },
          { name: "Joondalup", pinPrefixes: ["6027"] },
          { name: "Bunbury", pinPrefixes: ["6230"] }
        ]
      },
      "SA": {
        name: "South Australia",
        regions: [
          { name: "Adelaide", pinPrefixes: ["5000"] },
          { name: "Mount Gambier", pinPrefixes: ["5290"] },
          { name: "Gawler", pinPrefixes: ["5118"] }
        ]
      }
    }
  },
  "CA": {
    name: "Canada", currency: "CAD", symbol: "C$", rate: 1.36,
    states: {
      "ON": {
        name: "Ontario",
        regions: [
          { name: "Toronto", pinPrefixes: ["M"] },
          { name: "Ottawa", pinPrefixes: ["K"] },
          { name: "Mississauga", pinPrefixes: ["L"] },
          { name: "Hamilton", pinPrefixes: ["L8"] },
          { name: "London", pinPrefixes: ["N"] },
          { name: "Kingston", pinPrefixes: ["K7"] },
          { name: "Windsor", pinPrefixes: ["N9"] },
          { name: "Barrie", pinPrefixes: ["L4"] },
          { name: "Sudbury", pinPrefixes: ["P"] }
        ]
      },
      "BC": {
        name: "British Columbia",
        regions: [
          { name: "Vancouver", pinPrefixes: ["V5"] },
          { name: "Victoria", pinPrefixes: ["V8"] },
          { name: "Surrey", pinPrefixes: ["V3"] },
          { name: "Kelowna", pinPrefixes: ["V1"] },
          { name: "Kamloops", pinPrefixes: ["V2"] },
          { name: "Prince George", pinPrefixes: ["V2N"] }
        ]
      },
      "QC": {
        name: "Quebec",
        regions: [
          { name: "Montreal", pinPrefixes: ["H"] },
          { name: "Quebec City", pinPrefixes: ["G"] },
          { name: "Laval", pinPrefixes: ["H7"] },
          { name: "Gatineau", pinPrefixes: ["J"] },
          { name: "Sherbrooke", pinPrefixes: ["J1"] },
          { name: "Saguenay", pinPrefixes: ["G7"] }
        ]
      },
      "AB": {
        name: "Alberta",
        regions: [
          { name: "Calgary", pinPrefixes: ["T2"] },
          { name: "Edmonton", pinPrefixes: ["T5"] },
          { name: "Red Deer", pinPrefixes: ["T4"] },
          { name: "Lethbridge", pinPrefixes: ["T1"] }
        ]
      }
    }
  },
  "BR": {
    name: "Brazil", currency: "BRL", symbol: "R$", rate: 4.97,
    states: {
      "SP": {
        name: "São Paulo",
        regions: [
          { name: "São Paulo Capital", pinPrefixes: ["01"] },
          { name: "Campinas", pinPrefixes: ["13"] },
          { name: "Guarulhos", pinPrefixes: ["07"] },
          { name: "Santos", pinPrefixes: ["11"] },
          { name: "Ribeirão Preto", pinPrefixes: ["14"] },
          { name: "Sorocaba", pinPrefixes: ["18"] }
        ]
      },
      "RJ": {
        name: "Rio de Janeiro",
        regions: [
          { name: "Rio de Janeiro City", pinPrefixes: ["20"] },
          { name: "Niterói", pinPrefixes: ["24"] },
          { name: "Petrópolis", pinPrefixes: ["25"] }
        ]
      },
      "MG": {
        name: "Minas Gerais",
        regions: [
          { name: "Belo Horizonte", pinPrefixes: ["30"] },
          { name: "Uberlândia", pinPrefixes: ["38"] },
          { name: "Contagem", pinPrefixes: ["32"] }
        ]
      }
    }
  },
  "ZA": {
    name: "South Africa", currency: "ZAR", symbol: "R", rate: 18.6,
    states: {
      "WC": {
        name: "Western Cape",
        regions: [
          { name: "Cape Town CBD", pinPrefixes: ["8001"] },
          { name: "Stellenbosch", pinPrefixes: ["7600"] },
          { name: "George", pinPrefixes: ["6530"] },
          { name: "Paarl", pinPrefixes: ["7646"] }
        ]
      },
      "GP": {
        name: "Gauteng",
        regions: [
          { name: "Johannesburg", pinPrefixes: ["2000"] },
          { name: "Pretoria", pinPrefixes: ["0001"] },
          { name: "Sandton", pinPrefixes: ["2196"] },
          { name: "Soweto", pinPrefixes: ["1804"] },
          { name: "Centurion", pinPrefixes: ["0046"] }
        ]
      },
      "KZN": {
        name: "KwaZulu-Natal",
        regions: [
          { name: "Durban", pinPrefixes: ["4001"] },
          { name: "Pietermaritzburg", pinPrefixes: ["3201"] },
          { name: "Richards Bay", pinPrefixes: ["3900"] }
        ]
      }
    }
  },
  "SG": {
    name: "Singapore", currency: "SGD", symbol: "S$", rate: 1.34,
    states: {
      "CENTRAL": {
        name: "Central Region",
        regions: [
          { name: "Orchard / River Valley", pinPrefixes: ["23"] },
          { name: "Marina Bay", pinPrefixes: ["01"] },
          { name: "Toa Payoh", pinPrefixes: ["31"] },
          { name: "Bishan", pinPrefixes: ["57"] }
        ]
      },
      "EAST": {
        name: "East Region",
        regions: [
          { name: "Tampines", pinPrefixes: ["52"] },
          { name: "Bedok", pinPrefixes: ["46"] },
          { name: "Pasir Ris", pinPrefixes: ["51"] },
          { name: "Changi", pinPrefixes: ["49"] }
        ]
      },
      "WEST": {
        name: "West Region",
        regions: [
          { name: "Jurong East", pinPrefixes: ["60"] },
          { name: "Boon Lay", pinPrefixes: ["64"] },
          { name: "Clementi", pinPrefixes: ["12"] }
        ]
      }
    }
  },
  "AE": {
    name: "UAE", currency: "AED", symbol: "د.إ", rate: 3.67,
    states: {
      "DXB": {
        name: "Dubai",
        regions: [
          { name: "Downtown Dubai", pinPrefixes: [""] },
          { name: "Dubai Marina", pinPrefixes: [""] },
          { name: "Jumeirah", pinPrefixes: [""] },
          { name: "Al Barsha", pinPrefixes: [""] },
          { name: "Deira", pinPrefixes: [""] },
          { name: "Business Bay", pinPrefixes: [""] },
          { name: "JVC / JVT", pinPrefixes: [""] }
        ]
      },
      "AUH": {
        name: "Abu Dhabi",
        regions: [
          { name: "Abu Dhabi Island", pinPrefixes: [""] },
          { name: "Khalidiyah", pinPrefixes: [""] },
          { name: "Al Reem Island", pinPrefixes: [""] },
          { name: "Al Mushrif", pinPrefixes: [""] },
          { name: "Baniyas", pinPrefixes: [""] }
        ]
      },
      "SHJ": {
        name: "Sharjah",
        regions: [
          { name: "Sharjah City", pinPrefixes: [""] },
          { name: "Al Nahda (SHJ)", pinPrefixes: [""] },
          { name: "Al Majaz", pinPrefixes: [""] }
        ]
      }
    }
  },
  "PK": {
    name: "Pakistan", currency: "PKR", symbol: "Rs", rate: 278,
    states: {
      "PB": {
        name: "Punjab",
        regions: [
          { name: "Lahore", pinPrefixes: ["54"] },
          { name: "Faisalabad", pinPrefixes: ["38"] },
          { name: "Rawalpindi", pinPrefixes: ["46"] },
          { name: "Gujranwala", pinPrefixes: ["52"] },
          { name: "Multan", pinPrefixes: ["60"] },
          { name: "Bahawalpur", pinPrefixes: ["63"] }
        ]
      },
      "SD": {
        name: "Sindh",
        regions: [
          { name: "Karachi", pinPrefixes: ["74"] },
          { name: "Hyderabad", pinPrefixes: ["71"] },
          { name: "Sukkur", pinPrefixes: ["65"] }
        ]
      },
      "KPK": {
        name: "Khyber Pakhtunkhwa",
        regions: [
          { name: "Peshawar", pinPrefixes: ["25"] },
          { name: "Abbottabad", pinPrefixes: ["22"] },
          { name: "Swat", pinPrefixes: ["19"] }
        ]
      }
    }
  },
  "BD": {
    name: "Bangladesh", currency: "BDT", symbol: "৳", rate: 110,
    states: {
      "DHAKA": {
        name: "Dhaka Division",
        regions: [
          { name: "Dhaka City (Gulshan/Banani)", pinPrefixes: ["1212"] },
          { name: "Dhaka City (Mirpur/Dhanmondi)", pinPrefixes: ["1216"] },
          { name: "Narayanganj", pinPrefixes: ["1400"] },
          { name: "Gazipur", pinPrefixes: ["1700"] },
          { name: "Manikganj", pinPrefixes: ["1800"] }
        ]
      },
      "CTG": {
        name: "Chittagong Division",
        regions: [
          { name: "Chittagong City", pinPrefixes: ["4000"] },
          { name: "Cox's Bazar", pinPrefixes: ["4700"] },
          { name: "Rangamati", pinPrefixes: ["4500"] }
        ]
      }
    }
  },
  "NG": {
    name: "Nigeria", currency: "NGN", symbol: "₦", rate: 1540,
    states: {
      "LA": {
        name: "Lagos",
        regions: [
          { name: "Lagos Island / Victoria Island", pinPrefixes: ["101"] },
          { name: "Lekki", pinPrefixes: ["106"] },
          { name: "Ikeja", pinPrefixes: ["100"] },
          { name: "Surulere", pinPrefixes: ["101"] },
          { name: "Badagry", pinPrefixes: ["103"] }
        ]
      },
      "AB": {
        name: "Abuja (FCT)",
        regions: [
          { name: "Central Business District", pinPrefixes: ["900"] },
          { name: "Maitama", pinPrefixes: ["900"] },
          { name: "Garki", pinPrefixes: ["900"] },
          { name: "Karu", pinPrefixes: ["901"] }
        ]
      }
    }
  },
  "MX": {
    name: "Mexico", currency: "MXN", symbol: "Mex$", rate: 17.2,
    states: {
      "CDMX": {
        name: "Mexico City (CDMX)",
        regions: [
          { name: "Polanco / Miguel Hidalgo", pinPrefixes: ["11"] },
          { name: "Condesa / Cuauhtémoc", pinPrefixes: ["06"] },
          { name: "Coyoacán", pinPrefixes: ["04"] },
          { name: "Iztapalapa", pinPrefixes: ["09"] },
          { name: "Milpa Alta", pinPrefixes: ["12"] }
        ]
      },
      "JAL": {
        name: "Jalisco",
        regions: [
          { name: "Guadalajara", pinPrefixes: ["44"] },
          { name: "Zapopan", pinPrefixes: ["45"] },
          { name: "Tlaquepaque", pinPrefixes: ["45"] },
          { name: "Puerto Vallarta", pinPrefixes: ["48"] },
          { name: "Tequila", pinPrefixes: ["46"] }
        ]
      },
      "NL": {
        name: "Nuevo León",
        regions: [
          { name: "Monterrey", pinPrefixes: ["64"] },
          { name: "San Pedro Garza García", pinPrefixes: ["66"] },
          { name: "Guadalupe", pinPrefixes: ["67"] }
        ]
      }
    }
  },
  "ID": {
    name: "Indonesia", currency: "IDR", symbol: "Rp", rate: 15700,
    states: {
      "DKI": {
        name: "DKI Jakarta",
        regions: [
          { name: "Jakarta Pusat", pinPrefixes: ["10"] },
          { name: "Jakarta Selatan", pinPrefixes: ["12"] },
          { name: "Jakarta Barat", pinPrefixes: ["11"] },
          { name: "Jakarta Utara", pinPrefixes: ["14"] },
          { name: "Jakarta Timur", pinPrefixes: ["13"] }
        ]
      },
      "JK": {
        name: "West Java",
        regions: [
          { name: "Bandung", pinPrefixes: ["40"] },
          { name: "Bekasi", pinPrefixes: ["17"] },
          { name: "Bogor", pinPrefixes: ["16"] },
          { name: "Depok", pinPrefixes: ["16"] },
          { name: "Sukabumi", pinPrefixes: ["43"] }
        ]
      },
      "JT": {
        name: "Central Java",
        regions: [
          { name: "Semarang", pinPrefixes: ["50"] },
          { name: "Solo (Surakarta)", pinPrefixes: ["57"] },
          { name: "Yogyakarta", pinPrefixes: ["55"] }
        ]
      }
    }
  },
  "IT": {
    name: "Italy", currency: "EUR", symbol: "€", rate: 0.92,
    states: {
      "LOM": {
        name: "Lombardy",
        regions: [
          { name: "Milan", pinPrefixes: ["20"] },
          { name: "Bergamo", pinPrefixes: ["24"] },
          { name: "Brescia", pinPrefixes: ["25"] },
          { name: "Varese", pinPrefixes: ["21"] }
        ]
      },
      "LAZ": {
        name: "Lazio",
        regions: [
          { name: "Rome", pinPrefixes: ["00"] },
          { name: "Latina", pinPrefixes: ["04"] },
          { name: "Viterbo", pinPrefixes: ["01"] }
        ]
      },
      "CAM": {
        name: "Campania",
        regions: [
          { name: "Naples", pinPrefixes: ["80"] },
          { name: "Salerno", pinPrefixes: ["84"] },
          { name: "Caserta", pinPrefixes: ["81"] }
        ]
      }
    }
  },
  "KR": {
    name: "South Korea", currency: "KRW", symbol: "₩", rate: 1325,
    states: {
      "SE": {
        name: "Seoul",
        regions: [
          { name: "Gangnam-gu", pinPrefixes: ["06"] },
          { name: "Mapo-gu", pinPrefixes: ["04"] },
          { name: "Jongno-gu", pinPrefixes: ["03"] },
          { name: "Nowon-gu", pinPrefixes: ["01"] },
          { name: "Dobong-gu", pinPrefixes: ["01"] }
        ]
      },
      "BS": {
        name: "Busan",
        regions: [
          { name: "Haeundae-gu", pinPrefixes: ["48"] },
          { name: "Suyeong-gu", pinPrefixes: ["48"] },
          { name: "Gijang-gun", pinPrefixes: ["46"] }
        ]
      },
      "IC": {
        name: "Incheon",
        regions: [
          { name: "Incheon (Songdo)", pinPrefixes: ["21"] },
          { name: "Incheon (Bupyeong)", pinPrefixes: ["21"] }
        ]
      }
    }
  }
};

// Default area type info (used for price context only — user now selects manually)
const AREA_TYPE_INFO = {
  "urban":      { label: "🏙️ Urban",      multiplier: 1.0,  desc: "City centre / metro area" },
  "semi-urban": { label: "🏘️ Semi-Urban", multiplier: 0.75, desc: "Suburbs / mid-sized towns" },
  "rural":      { label: "🌾 Rural",       multiplier: 0.45, desc: "Village / countryside" }
};