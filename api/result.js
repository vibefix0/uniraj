import cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { roll, dob } = req.query;

    if (!roll || !dob) {
      return res.status(400).json({ error: "Roll or DOB missing" });
    }

    const unirajURL = `https://result.uniraj.ac.in/StudentPanel/result/getResult?rollno=${roll}&dob=${dob}`;

    const response = await fetch(unirajURL);
    const html = await response.text();

    const $ = cheerio.load(html);

    let result = {};

    $("table tr").each((i, row) => {
      const cols = $(row).find("td");
      const key = $(cols[0]).text().trim();
      const val = $(cols[1]).text().trim();
      if (key && val) result[key] = val;
    });

    if (Object.keys(result).length === 0) {
      return res.status(404).json({ error: "No result found. Wrong roll or DOB?" });
    }

    res.status(200).json({
      status: "success",
      roll,
      dob,
      data: result
    });

  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.toString() });
  }
      }
