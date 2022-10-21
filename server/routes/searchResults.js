const express = require('express');
const router = express.Router();
const axios = require('axios');
const url = require('url');

router.get('/:query', async (req, res) => {
    try {
        // Adicionar API_KEY e a Query
        const params = new URLSearchParams({
            access_token: process.env.API_KEY,
            ...url.parse(req.url, true).query,
        });
        console.log(params);
        const query = req.params.query;
        const result = await axios(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params}`
        );
        const data = result.data;
        res.status(200).json(data);
    } catch(err) {
        res.status(500).json({error: err.message})
    }
});

module.exports = router;