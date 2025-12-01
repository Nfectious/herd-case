const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.use('/documents', express.static('documents'));

// API endpoint to get case data
app.get('/api/case-data', (req, res) => {
  try {
    const data = {
      title: "Travis Herd v. Progressive Insurance Company",
      subtitle: "Multiple Claims - Systematic Bad Faith - Regulatory Corruption",
      lastUpdated: "November 27, 2025",

      overview: {
        title: "Case Overview",
        summary: "This case documents systematic bad faith insurance practices by Progressive Insurance Company against Travis Herd, including policy manipulation on the day of an accident, fabricated evidence, regulatory misrepresentation, and harassment during medical crisis.",
        keyPoints: [
          "219+ days without claim resolution while claimant confined to wheelchair",
          "Policy removed by mother (policyholder) on day of accident, then re-added 4 months later with $2,610 charge",
          "Progressive accepted 16-17 months of premiums, then claimed vehicle was sold 10 months prior",
          "State regulator told claimant to 'shut up and do as you're told'",
          "Four shifting denial rationales prove bad faith pattern",
          "Conflicts during daughter's Marine Corps deployment and medical emergencies"
        ]
      },

      medicalStatus: {
        title: "Claimant's Medical Status",
        conditions: [
          "Multiple Sclerosis (MS)",
          "Congestive Heart Failure (CHF)",
          "Surgical pins in leg (July 13, 2025 accident)",
          "Wheelchair confinement: 3 months (July-October 2025)",
          "Currently learning to walk with cane (November 2025)",
          "Ongoing pain and mobility limitations"
        ],
        impact: "Rural Tennessee location with no public transportation. Unable to access medical care, groceries, or necessities for 219+ days after Progressive took vehicle and ended rental.",
        familyConflict: "Mother Dorothy Herd (policyholder) removed Travis from policy on day of accident, refused assistance during wheelchair confinement, threatened eviction, and cooperated with Progressive in denying claim while paying $2,610 charge."
      },

      timeline: [
        {
          date: "December 2023 / January 2024",
          event: "Progressive Insurance Coverage Begins",
          details: "Travis Herd added to mother Dorothy's Progressive policy for Honda vehicle. Premium payments begin and continue for 16-17 months without any underwriting objections regarding ownership or title.",
          significance: "Creates estoppel - Progressive cannot later deny coverage after accepting premiums without objection for over a year."
        },
        {
          date: "April 22, 2025 - 4:40 PM",
          event: "CRITICAL: Mother Removes Travis from Policy",
          details: "Dorothy Herd removes Travis from Progressive Policy #930700834. Premium decreases by $532.25. Travis receives NO notification of removal.",
          significance: "Same day as accident. Creates severe conflict of interest and potential conspiracy."
        },
        {
          date: "April 22, 2025 (Same Day)",
          event: "Vehicle Accident Occurs",
          details: "Travis Herd involved in accident with insured Honda vehicle. Files Claim #25-822866566 with Progressive.",
          significance: "Accident occurs on same day mother removed him from policy, without his knowledge."
        },
        {
          date: "May 6, 2025",
          event: "Progressive Declares Total Loss",
          details: "Progressive declares Honda a total loss and begins claim process.",
          significance: "Progressive initiating claim process implies coverage acknowledgment."
        },
        {
          date: "May 19, 2025",
          event: "Progressive Takes Possession of Vehicle",
          details: "Tow company takes vehicle to Progressive's facility without speaking to Travis (he was present at location).",
          significance: "By taking possession without title, Progressive assumed duty to perfect title per TCA §55-3-211."
        },
        {
          date: "May 22, 2025",
          event: "Rental Coverage Ends",
          details: "Progressive ends rental car coverage, leaving Travis without transportation despite disability, MS, CHF, and rural location with no public transit.",
          significance: "Begins 219+ day period without access to medical care, groceries, or necessities."
        },
        {
          date: "May 28, 2025",
          event: "Total Loss Report Completed",
          details: "Progressive completes inspection and Total Loss Report. No mention of any pre-existing damage to suspension or missing components.",
          significance: "Later claims of 'pre-existing damage' contradicted by their own inspection report."
        },
        {
          date: "May - August 2025",
          event: "Impossible Bonded Title Demand",
          details: "Progressive demands bonded title despite having taken possession of vehicle. Creates impossible circular requirement - Travis cannot get bonded title without vehicle possession.",
          significance: "Prevention doctrine - cannot demand condition made impossible by own actions."
        },
        {
          date: "June 2025",
          event: "'Missing Vehicle' Allegation",
          details: "Progressive claims vehicle is 'missing' based on unverified phone call, not database search as later implied to regulators.",
          significance: "Unsubstantiated allegation with no caller ID, date, recording, or notes provided."
        },
        {
          date: "June 10, 2025",
          event: "Daughter Madison Sworn Into Marine Corps",
          details: "Travis's daughter Madison Herd sworn in as Marine Corps Intelligence Specialist (0231). Nearly missed due to transportation issues caused by Progressive denying claim.",
          significance: "First of multiple family interference incidents by Progressive's delays."
        },
        {
          date: "June 11, 2025",
          event: "Regulatory Capture - Bruce Moore",
          details: "Tennessee Department of Insurance regulator Bruce Moore dismisses complaint after only 5 days, tells Travis to 'shut up and do as you're told'.",
          significance: "Complete abandonment of consumer protection. Potential 42 USC §1983 civil rights violation."
        },
        {
          date: "June 21, 2024 (Evidence Date)",
          event: "Third-Party Database Verification",
          details: "Warranty companies sent mail to Travis for Honda vehicle, proving state databases recognized him as owner during the month Progressive claims vehicle was sold (June 2024).",
          significance: "These companies purchase verified DMV data. Mail proves databases showed Travis as owner, contradicting Progressive's 'sold June 2024' claim."
        },
        {
          date: "June 23, 2025",
          event: "Regulatory Misrepresentation",
          details: "Stanley Coker sends letter to Tennessee DOI with three false statements: (a) couldn't reach Travis for 16 days (actually 5), (b) ran database search (actually phone call), (c) bonded title only option (no such company policy exists).",
          significance: "Deliberate misrepresentation to state regulators to avoid oversight."
        },
        {
          date: "July 1, 2025",
          event: "Stanley Coker Admission",
          details: "Coker admits in email: 'We are merely reporting what we see from database runs and what we were told verbally by Budget' - contradicting June 23 claim of database search.",
          significance: "Admission that 'missing vehicle' allegation came from unverified verbal call, not database."
        },
        {
          date: "July 12, 2025",
          event: "Travis Purchases Different Vehicle",
          details: "Travis purchases a different vehicle (not the Honda), not insured with Progressive.",
          significance: "This vehicle becomes subject of suspicious second claim."
        },
        {
          date: "July 13, 2025",
          event: "Second Accident - Wheelchair Injury",
          details: "Single-vehicle accident (fell asleep driving). Travis sustains serious injuries requiring surgical pins in leg and wheelchair for 3 months. Did NOT notify Progressive, did NOT insure vehicle with Progressive, did NOT file claim.",
          significance: "Beginning of 3-month wheelchair confinement during ongoing Honda claim fight."
        },
        {
          date: "July 13, 2025",
          event: "Suspicious Claim #25-918737489 Opened",
          details: "Progressive mysteriously opens claim for July 13 accident on uninsured vehicle. Later claims 'ambulance service' opened it. How did ambulance know to contact Progressive for vehicle not insured with them?",
          significance: "Evidence suggests mother Dorothy reported without Travis's consent. HIPAA violation concerns. Shows double standard - uninsured vehicle claim opened immediately, insured Honda claim delayed 219+ days."
        },
        {
          date: "August 25, 2025 (Day 125)",
          event: "Continued Bad Faith by Coker",
          details: "Stanley Coker blames Travis, repeats surety bond demand (admitting no policy exists), threatens 'periodic Reservation of Rights letters', creates circular logic trap.",
          significance: "After 125 days, still demanding impossible conditions and shifting blame to claimant."
        },
        {
          date: "August 28, 2025",
          event: "Progressive Adds Travis BACK to Policy",
          details: "Progressive adds Travis back to mother's policy during 'claims investigation' - 4 months after removal. Charges mother Dorothy $2,610. Travis receives NO notification of re-addition.",
          significance: "Mother pays $2,610 despite Travis advising against it. Creates financial incentive for mother to oppose Travis's claim."
        },
        {
          date: "October 24, 2025 (Day 187)",
          event: "FOURTH Shifting Rationale: 'Pre-Existing Damage'",
          details: "After 187 days, Progressive introduces entirely new denial reason: 'vehicle has old damage to suspension and missing front-end components.' NEVER mentioned in any prior correspondence, inspection reports, or letters.",
          significance: "Fourth different excuse proves pattern of searching for ANY denial rather than good faith adjustment. Contradicts own May 28 inspection that found no such damage."
        },
        {
          date: "October 2025",
          event: "Travis Begins Walking with Cane",
          details: "After 3 months in wheelchair, Travis begins learning to walk with cane. Still in significant pain with mobility limitations.",
          significance: "Entire claim fight (219+ days) occurred during serious medical crisis and recovery."
        },
        {
          date: "November 27, 2025 (Day 219+)",
          event: "Claim Still Unresolved",
          details: "219+ days after accident, Progressive has still not resolved claim. Multiple shifting rationales, impossible demands, regulatory manipulation, and family conflict exploitation continue.",
          significance: "Systematic bad faith spanning over 7 months during medical crisis."
        }
      ],

      evidence: [
        {
          title: "1. Policy Manipulation (April 22 & August 28, 2025)",
          category: "Critical Evidence",
          description: "Mother Dorothy Herd (policyholder) removed Travis from Progressive Policy #930700834 on April 22, 2025 at 4:40 PM - the same day as his accident. Travis received NO notification. Progressive then added him back 4 months later (August 28) during 'claims investigation' and charged Dorothy $2,610.",
          violations: [
            "TCA §56-8-104 (Misrepresentation and False Advertising)",
            "TCA §56-8-105 (Unfair Claims Settlement Practices)",
            "Bad Faith Insurance Practices",
            "Conflict of Interest",
            "Potential Conspiracy to Defraud"
          ],
          evidence: [
            "April 22, 2025 Declarations Page showing removal and $532.25 premium decrease",
            "August 28, 2025 Declarations Page showing re-addition",
            "August 28, 2025 Underwriting Memo to Dorothy Herd",
            "Progressive billing showing $2,610 charge",
            "Zero notification to Travis about removal or re-addition"
          ]
        },
        {
          title: "2. Stanley Coker Admission: No Database Search",
          category: "Critical Evidence",
          description: "July 1, 2025 email from Stanley Coker admitted 'missing vehicle' allegation came from unverified phone call, NOT database search as implied to regulators.",
          quote: "We are merely reporting what we see from database runs and what we were told verbally by Budget",
          violations: [
            "Contradicts June 23, 2025 letter to Tennessee DOI",
            "Unsubstantiated allegations based on hearsay",
            "No caller identification, date, recording, or notes provided"
          ]
        },
        {
          title: "3. Impossible June 2024 Timeline",
          category: "Critical Evidence",
          description: "Progressive claims Budget Rent-a-Car sold vehicle in June 2024, yet Progressive continued accepting premium payments for 10+ months (July 2024 through April 2025). Only two possibilities: (1) Insurance fraud - knowingly accepting premiums on sold vehicle, or (2) Fabrication - vehicle was never sold.",
          significance: "No third option exists. Either constitutes fraud or bad faith."
        },
        {
          title: "3A. Third-Party Database Verification",
          category: "Critical Evidence",
          description: "June 21, 2024: Warranty companies sent mail to Travis for Honda vehicle. These companies purchase verified state DMV data. Mail proves state databases recognized Travis as owner DURING the exact month Progressive claims vehicle was sold (June 2024).",
          significance: "If vehicle was sold in June 2024, warranty companies would have stopped sending mail. Continued mail proves state databases showed Travis as owner, directly contradicting Progressive's timeline."
        },
        {
          title: "4. Regulatory Corruption: Bruce Moore",
          category: "Critical Evidence",
          description: "Tennessee Department of Insurance regulator Bruce Moore told Travis to 'SHUT UP AND DO AS YOU'RE TOLD' and dismissed complaint after only 5 days based on Progressive's misrepresentations.",
          violations: [
            "Complete abandonment of consumer protection duty",
            "Accepted Progressive's false statements without investigation",
            "Potential 42 USC §1983 violation (deprivation of rights under color of state law)"
          ]
        },
        {
          title: "5. August 25 Continued Bad Faith (Day 125)",
          category: "Critical Evidence",
          description: "After 125 days, Stanley Coker continued pattern: blamed Travis for delays, repeated surety bond demand while admitting no company policy exists, threatened 'periodic Reservation of Rights letters', created circular logic trap.",
          significance: "Demonstrates sustained bad faith pattern extending months beyond initial denial."
        },
        {
          title: "6. October 24: FOURTH Shifting Rationale",
          category: "Critical Evidence",
          description: "After 187 days, Progressive introduced FOURTH completely different denial rationale never mentioned before: 'The vehicle has old damage to suspension and missing front-end components'",
          shiftingRationales: [
            "April-June: 'Missing vehicle' (based on unverified phone call)",
            "May-August: 'Need bonded title' (admitted no policy requiring this exists)",
            "June-present: 'Sold June 2024' (contradicted by third-party database evidence)",
            "October 24: 'Pre-existing damage' (NEVER mentioned in 187 days, contradicts own May 28 inspection)"
          ],
          problems: [
            "Progressive inspected vehicle May 28, declared total loss, took possession May 19",
            "NEVER mentioned any damage in any prior correspondence",
            "VIN reports show no previous damage, salvage, or accident history",
            "Vehicle ran fine before April 20 accident",
            "Tow company took vehicle WITHOUT speaking to Travis (he was present)",
            "Letter falsely claims 'unable to reach you' (documented 5-day response time)",
            "Demands FOURTH recorded statement (already gave 3)",
            "Letter arrived before Madison's Virginia trip (4th family interference incident)"
          ],
          significance: "Shifting rationales prove Progressive searching for ANY excuse to deny rather than conducting good faith claim adjustment."
        },
        {
          title: "7. Suspicious Claim #25-918737489 (July 13, 2025)",
          category: "Critical Evidence",
          description: "Progressive opened claim for July 13 accident under highly suspicious circumstances revealing double standards and potential HIPAA violations.",
          facts: [
            "July 12: Travis bought different vehicle (not Honda)",
            "July 13: Single-vehicle accident, serious injuries",
            "Travis did NOT notify Progressive",
            "Travis did NOT insure vehicle with Progressive",
            "Travis did NOT file claim with Progressive",
            "YET: Progressive opened claim #25-918737489"
          ],
          questions: [
            "How did Progressive know about accident on uninsured vehicle?",
            "November 6 letter claims 'claim opened by ambulance service' - how did ambulance know to contact Progressive?",
            "Did mother Dorothy Herd report without Travis's consent? (Suspected)",
            "HIPAA violation? Privacy concerns?",
            "Why pursue claim on uninsured vehicle?"
          ],
          doubleStandard: "Honda (insured 16-17 months): 'Can't verify ownership, can't reach claimant, 219+ days no resolution' vs. July vehicle (NOT insured): 'Found immediately, claim opened, correspondence sent'",
          motherConflict: [
            "Dorothy likely reported July accident without Travis's consent",
            "Paid $2,610 Progressive charged despite Travis's objection",
            "Refuses to discuss claims with Travis",
            "Refuses help during wheelchair confinement",
            "Threatened eviction"
          ],
          conclusion: "Evidence shows policyholder actively cooperating with insurer against insured family member."
        }
      ],

      systematicBadFaith: {
        title: "Systematic Bad Faith: 10-Point Pattern",
        points: [
          {
            number: 1,
            title: "Premium Acceptance (16-17 months)",
            description: "Progressive accepted premium payments from December 2023/January 2024 through April 2025 (16-17 months) without any underwriting objection to ownership or title status.",
            significance: "Creates overwhelming estoppel. Progressive cannot claim coverage issues after over a year of accepting payments without objection."
          },
          {
            number: 2,
            title: "Policy Manipulation (April 22, 2025)",
            description: "Mother Dorothy Herd removed Travis from policy on day of accident (4:40 PM). Progressive added him back 4 months later (August 28), charged mother $2,610. Travis received ZERO notification about removal or re-addition.",
            significance: "Creates severe conflict of interest: mother removed son from coverage on accident day, then cooperated with Progressive in denying his claim, while Progressive charged her for re-adding him."
          },
          {
            number: 3,
            title: "Possession Taking (May 6 & 19, 2025)",
            description: "Progressive declared total loss May 6, took physical possession May 19, completed Total Loss Report May 28. Tow company left without speaking to Travis (who was present).",
            significance: "TCA §55-3-211: By taking possession without having title, Progressive assumed legal duty to perfect title. Cannot later demand Travis provide what Progressive made impossible."
          },
          {
            number: 4,
            title: "Impossible Requirements (May-August)",
            description: "Progressive demanded bonded title AFTER taking possession of vehicle, creating circular impossibility.",
            significance: "Prevention doctrine: Cannot demand condition made impossible by own actions. Travis cannot get bonded title without vehicle possession that Progressive took."
          },
          {
            number: 5,
            title: "Unsubstantiated Allegations (June 2025)",
            description: "'Missing vehicle' allegation based on unverified phone call with no caller identification, date, recording, or notes.",
            significance: "July 1 Coker email admitted: 'verbally by Budget' - contradicts June 23 regulator letter implying database search."
          },
          {
            number: 6,
            title: "Contradictory Instructions",
            description: "Progressive agent: 'can't use surety bonds for titles.' Stanley Coker: 'only option.' July 1: 'no company policy exists' / 'training error.'",
            significance: "Creates impossible compliance trap - claimant cannot satisfy contradictory demands."
          },
          {
            number: 7,
            title: "Regulatory Misrepresentation (June 23, 2025)",
            description: "Stanley Coker letter to Tennessee DOI contained three false statements: (a) couldn't reach Travis for 16 days (actually 5 days), (b) ran database search (actually unverified phone call), (c) bonded title is only option (no such company policy exists).",
            significance: "Deliberate misrepresentation to state regulators to avoid oversight and accountability."
          },
          {
            number: 8,
            title: "Regulatory Capture (June 11, 2025)",
            description: "Tennessee regulator Bruce Moore dismissed complaint after only 5 days, told Travis to 'shut up and do as you're told,' completely abandoned consumer protection duty.",
            significance: "Potential 42 USC §1983 civil rights violation - deprivation of rights under color of state law."
          },
          {
            number: 9,
            title: "Impossible Timeline (June 2024 claim)",
            description: "Progressive claims Budget sold vehicle June 2024, yet accepted premiums for 10+ months after alleged sale. Third-party warranty companies sent mail June 21, 2024 proving state databases showed Travis as owner.",
            significance: "Only two possibilities: (1) Insurance fraud - knowingly accepting premiums on sold vehicle, or (2) Fabrication - vehicle never sold. No third option."
          },
          {
            number: 10,
            title: "Shifting Rationales (April-October)",
            description: "Four completely different denial reasons over 187+ days: (1) Missing vehicle, (2) Need bonded title, (3) Sold June 2024, (4) Pre-existing damage.",
            significance: "Pattern proves Progressive searching for ANY excuse to deny rather than conducting good faith claim investigation. October 24 'pre-existing damage' claim introduced after 187 days, NEVER mentioned during inspections or when taking possession."
          }
        ]
      },

      legalClaims: [
        {
          title: "Bad Faith (TCA §56-7-105)",
          description: "Progressive unreasonably delayed, denied, and underpaid legitimate claim. Failed to conduct reasonable investigation, relied on unverified phone call, demanded impossible conditions, gave contradictory instructions, misrepresented facts to regulators, manipulated policy coverage, and accepted premiums on allegedly sold vehicle.",
          damages: "25% penalty on claim amount plus attorney fees and costs."
        },
        {
          title: "Unfair Claims Settlement Practices (TCA §56-8-105)",
          violations: [
            "(1) Misrepresenting pertinent facts or insurance policy provisions",
            "(4) Failing to acknowledge and act with reasonable promptness upon communications",
            "(5) Not attempting in good faith to effectuate prompt, fair, and equitable settlements",
            "(6) Compelling insureds to institute litigation through unreasonable delay",
            "(14) Delaying investigation or payment of claims without reasonable explanation"
          ]
        },
        {
          title: "Insurance Fraud (TCA §56-53-101)",
          description: "If Progressive knew or should have known vehicle was sold in June 2024 but continued accepting premium payments through April 2025 (10+ months), this constitutes insurance fraud. Accepting premiums while knowing no valid coverage exists is fraudulent conduct.",
          significance: "Criminal and civil liability for knowingly collecting premiums on non-existent coverage."
        },
        {
          title: "Estoppel",
          description: "Progressive is estopped from denying coverage after accepting 16-17 months of premium payments without any objection to ownership or title status. Underwriting department had ample opportunity to discover any title issues during this extended period. Acceptance of premiums created reasonable reliance.",
          significance: "Cannot accept benefits of premium payments then deny coverage obligations."
        },
        {
          title: "Federal Civil Rights Violation (42 USC §1983)",
          description: "Tennessee regulator Bruce Moore's conduct - telling claimant to 'shut up and do as told,' dismissing complaint without proper investigation, accepting insurance company misrepresentations without verification - may constitute deprivation of civil rights under color of state law.",
          significance: "Tennessee has constitutional duty to regulate insurance industry fairly and protect consumers. Moore's actions appear to violate due process and equal protection rights."
        }
      ],

      damages: {
        economic: [
          "Vehicle claim value plus interest",
          "219+ days without transportation",
          "Lost access to medical care (MS, CHF treatment)",
          "Lost employment opportunities",
          "Additional expenses incurred",
          "Attorney fees and costs"
        ],
        statutory: [
          "25% bad faith penalty (TCA §56-7-105)",
          "Treble damages for unfair practices",
          "Federal civil rights damages (42 USC §1983)"
        ],
        punitive: [
          "Substantial punitive damages for willful and wanton conduct",
          "Pattern of deliberate misconduct",
          "Exploitation of disabled claimant during medical crisis",
          "Regulatory manipulation and corruption"
        ],
        personal: [
          "Medical impact: Unable to access treatment for MS and CHF for 219+ days",
          "Family impact: Interference with daughter Madison's final weeks before Marine Corps deployment",
          "Emotional distress: Abandoned by insurer AND family during wheelchair confinement",
          "Housing instability: Mother's eviction threats during medical crisis",
          "Social isolation: Rural Tennessee with no transportation or family support"
        ]
      },

      personalImpact: {
        medical: "Travis Herd is disabled with Multiple Sclerosis (MS) and Congestive Heart Failure (CHF). Lives in rural Tennessee with no public transportation. Progressive took his vehicle and ended rental coverage May 22, 2025, leaving him unable to access medical care, groceries, or basic necessities for 219+ days.",
        july13Accident: "July 13, 2025 accident resulted in surgical pins in leg and 3 months wheelchair confinement (July-October). Currently learning to walk with cane. Entire claim fight occurred during serious medical crisis and recovery.",
        familyConflict: "Mother Dorothy Herd (policyholder): (1) Removed Travis from policy day of accident, (2) Refused assistance despite wheelchair confinement and medical needs, (3) Threatened eviction ('nothing but trouble'), (4) Refused to discuss Progressive claims, (5) Paid $2,610 Progressive charged despite Travis advising against it, (6) Likely reported July 13 accident without Travis's knowledge/consent.",
        daughterMadison: "Daughter Madison Herd: Intelligence Specialist (0231) U.S. Marine Corps. Progressive's delays caused interference with THREE critical family events: (1) Final weeks of high school senior year (April-May 2025), (2) Marine Corps swearing-in ceremony (June 10, 2025) - nearly missed due to transportation, (3) Deployment to Parris Island for 13 weeks basic training. Travis deprived of precious final time with daughter before military service due to Progressive's bad faith delays.",
        timeline: "Timeline of suffering: April 22 (accident) → May 22 (rental ended, transportation lost) → June 10 (daughter's swearing-in, nearly missed) → July 13 (second accident, wheelchair confinement begins) → October (begins walking with cane) → November 27 (Day 219+, still no resolution). Seven months of systematic denial during medical crisis, family milestone interference, and abandonment."
      },

      conclusion: {
        evolution: "Case evolved from standard bad faith insurance dispute into documentation of systematic fraud involving policy manipulation, fabricated evidence, regulatory misrepresentation, regulatory capture, and harassment of disabled claimant during wheelchair confinement.",
        progressiveExposure: [
          "Original claim amount plus interest",
          "25% bad faith penalty (TCA §56-7-105)",
          "Substantial punitive damages for willful and wanton conduct",
          "Federal civil rights damages (42 USC §1983)",
          "Full attorney fees and costs",
          "Media exposure of regulatory corruption",
          "Tennessee Attorney General insurance fraud investigation",
          "Professional discipline for involved attorneys"
        ],
        caseStrength: "98% confidence. Methodical evidence collection over 219+ days created attorney-ready case with ironclad proof of bad faith. Progressive's own admissions, contradictions, and shifting rationales provide strongest evidence of systematic misconduct."
      }
    };

    res.json(data);
  } catch (error) {
    console.error('Error serving case data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for document search
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';

  if (!query) {
    return res.json({ results: [] });
  }

  // Read documents for search
  const attorneyBrief = fs.readFileSync(path.join(__dirname, 'attorney_brief.txt'), 'utf-8');
  const criticalMemo = fs.readFileSync(path.join(__dirname, 'CRITICAL_CORRECTION_MEMO.txt'), 'utf-8');

  const results = [];

  // Search attorney brief
  const briefLines = attorneyBrief.split('\n');
  briefLines.forEach((line, index) => {
    if (line.toLowerCase().includes(query)) {
      results.push({
        document: 'Attorney Brief',
        lineNumber: index + 1,
        content: line.trim(),
        context: briefLines.slice(Math.max(0, index - 1), Math.min(briefLines.length, index + 2)).join(' ').trim()
      });
    }
  });

  // Search critical memo
  const memoLines = criticalMemo.split('\n');
  memoLines.forEach((line, index) => {
    if (line.toLowerCase().includes(query)) {
      results.push({
        document: 'Critical Correction Memo',
        lineNumber: index + 1,
        content: line.trim(),
        context: memoLines.slice(Math.max(0, index - 1), Math.min(memoLines.length, index + 2)).join(' ').trim()
      });
    }
  });

  res.json({ results: results.slice(0, 50) }); // Limit to 50 results
});

// Serve documents for download
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const allowedFiles = [
    'ATTORNEY_BRIEF_COMPREHENSIVE_COMPLETE.docx',
    'CRITICAL_CORRECTION_MEMO.txt'
  ];

  if (!allowedFiles.includes(filename)) {
    return res.status(404).send('File not found');
  }

  const filePath = path.join(__dirname, filename);
  res.download(filePath);
});

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Access the website at http://localhost:${PORT}`);
});
