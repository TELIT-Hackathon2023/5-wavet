var client = require("../database/databasepg");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const noticationMail = require("./mail")
const schedule = require('node-schedule');


const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json("Zadaj meno a heslo")
        return
    }

    var sql = `SELECT * FROM employee WHERE email = '${email}'`;
    client.query(sql, async function (err, result) {
        if (err) {
            res.status(400).json(err)
            console.log(err);
        } else {
            console.log(result.rows[0]);
            if (result.rows.length !== 1) {
                res.status(400).json({ error: "Nesprávny email!" })
                return
            }
            const user = result.rows[0];

            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                res.status(400).json({ error: "Nesprávne heslo!" })
                return
            }
            const token = createToken(user.id, user.rights)
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
                loginUser({ body: { email, password } }, res);
                    schedule.scheduleJob(new Date(result.rows[0].created_at.getTime() + 24 * 60 * 60 * 1000), async () => {
                    deleteUnverifiedAccount(result.rows[0].id);
                });
            }

        });

    });
}

const verifyUser = async (req, res) => {
    const { id } = req.query.id
    client.query(`UPDATE employee SET verified = true WHERE id = ${id}`, function (err, result) {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json({ action: true, message: "Succesfully verified" })
        }
    });
}

const updateUserNames = async (req, res) => {
    const { id, first_name, last_name } = req.body
    client.query(`UPDATE employee SET first_name = '${first_name}', last_name = '${last_name}' WHERE id = ${id}`, function (err, result) {
        if (err) {
            res.status(400).json({error:err})
            console.log(err);
        } else {
            res.status(200).json({ action: true, message: "User updated" })
        }
    });
}

const updatePassword = async (req, res) => {
    const {id, new_password, old_password} = req.body
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(new_password, salt); 
    client.query(`UPDATE employee SET password = '${hash}' WHERE id = ${id}`, function(err, result){
        if (err) {
            res.status(400).json({error:err})
            console.log(err);
        } else {
            res.status(200).json({ action: true, message: "Password updated" })
        }
    });
   
}

async function deleteUnverifiedAccount(userId) {
    const checkSql = `
        SELECT id FROM employee
        WHERE id = $1 AND verified = false
    `;

    client.query(checkSql, [userId], (checkErr, checkResult) => {
        if (checkErr) {
            console.error(`Error checking unverified account: ${checkErr}`);
        } else {
            if (checkResult.rows.length > 0) {
                const deleteSql = `
                    DELETE FROM employee
                    WHERE id = $1
                `;

                client.query(deleteSql, [userId], (deleteErr, deleteResult) => {
                    if (deleteErr) {
                        console.error(`Error deleting unverified account: ${deleteErr}`);
                    } else {
                        console.log(`Deleted unverified account successfully. Rows affected: ${deleteResult.rowCount}`);
                    }
                });
            } else {
                console.log(`Account with ID ${userId} is either verified or does not exist.`);
            }
        }
    });
}

const createToken = (ID, rights) => {
    return jwt.sign({ ID, rights }, "AE>iCm.8gjT4fZIZNAmxP8RF7/2G^N$!b@£4Z@^O`'su:~55tX", { expiresIn: '2w' })
}


module.exports = { signupUser, loginUser, verifyUser, updateUserNames, updatePassword }

