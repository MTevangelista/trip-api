
import express from 'express'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' })
})

const port = 3333
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}) 