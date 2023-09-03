const express = require("express");

const app = express();
const timeout = 100000;
const sortNumbers = (numbers) => {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            if (numbers[i] > numbers[j]) {
                const temp = numbers[i];
                numbers[i] = numbers[j];
                numbers[j] = temp;
            }
        }
    }

    return numbers;
};
app.get("/numbers", async (req, res) => {
    const urls = String(req.query.url).split(",");
    let numbers = [];

    for (const url of urls) {
        let response
        try {
            response = await fetch(url, { timeout });
        }
        catch (err) {
            if (err.name === "TimeoutError") {
                console.log(`Timeout fetching data from ${url}`);
            } else {
                throw err;
            }
        }
        if (response.status == 200) {
            const data = await response.json();
            numbers.push(...new Set(data.numbers));
        }
        else {
            console.log(`Error fetching data from ${url}. Status code: ${response.status}`);
        }

    }
    numbers = sortNumbers(numbers);
    res.json([...new Set(numbers)]);
});

app.listen(8008, () => {
    console.log("Number-management service is running on port 8008");
});
