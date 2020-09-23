import express from 'express'

import placeRoute from './routes/place-route'

const app = express()

app.use(express.json())

app.use('/api/place', placeRoute)

const port = 3333
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})