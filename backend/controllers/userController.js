var client = require("../database/databasepg");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const noticationMail = require("./mail")


const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json("Zadaj meno a heslo")
        return
    }

    var sql = `SELECT * FROM admin WHERE email = '${email}'`;
    client.query(sql, async function (err, result) {
        if (err) {
            res.status(400).json(err)

        } else {
            console.log(result);
            if (result.length !== 1) {
                res.status(400).json({ error: "Nesprávny email!" })
                return
            }
            const user = result[0];

            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                res.status(400).json({ error: "Nesprávne heslo!" })
                return
            }
            const token = createToken(user.ID, user.rights)
            user.password = 'hidden'
            user.token = token
            res.status(200).json(user)

        }

    });
}
const signupUser = async (req, res) => {
    const { password, email, firstName, lastName } = req.body
    console.log(password, email, firstName, lastName);
    var emails = []
    client.query(`SELECT email FROM employee`, async function (err, result) {
        if (err) throw err;
        emails = result.rows.map(e => e.email)
        if (emails.includes(email)) {
            console.log("eerr");
            res.status(400).json({ error: "Email sa už používa" })
            return
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        var sql = `INSERT INTO employee (password, email, first_name, last_name, verified) VALUES (${"'" + hash + "','" + email + "','" + firstName + "','" + lastName + "'," + false})`;
        client.query(sql, function (err, result) {
            if (err) {
                res.status(400).json(err)
                console.log(err);
            } else {
                var rights = 0
                noticationMail(email);

                const token = createToken(result.insertId, rights)
                res.status(200).json({ email, firstName, lastName, rights, token })
            }

        });

    });
}


const createToken = (ID, rights) => {
    return jwt.sign({ ID, rights }, "AE>iCm.8gjT4fZIZNAmxP8RF7/2G^N$!b@£4Z@^O`'su:~55tX", { expiresIn: '2w' })
}


module.exports = { signupUser, loginUser }