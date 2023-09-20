const express = require('express');
const router = express.Router();
const { userModel } = require('../models/user.model');

//render
router.get("/register", (req, res) => {
    try {
        res.render("register.handlebars")
    } catch (error) {
        res.status(500).send("Error de render")
    }
})

router.get("/", (req, res) => {
    try {
        res.render("login.handlebars")
    } catch (error) {
        res.status(500).send("Error de render.")
    }
})

//Profile
router.get('/profile', (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/');
        }

        let { first_name, last_name, email, age, rol } = req.session.user;

        res.render('profile.handlebars', {
            first_name, last_name, email, age, rol
        });

    } catch (error) {
        res.status(500).send("Error de render.")
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.redirect('/')
        } else {
            res.send("Error al intentar salir.")
        }
    })
})



//Register
router.post("/register", async (req, res) => {
    try {
        let { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send('Falta algun Campo por completar');
        }

        let user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password
        })

        res.redirect("/")

    } catch (error) {
        res.status(500).send("Error de registro.")
    }
})

//Login
router.post('/', async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ status: "error", error: "valores incorrectos" })

        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            
            //admin
            req.session.user = {
                first_name: "Admin",
                last_name: "Coder",
                email: "adminCoder@coder.com",
                age: 30,
                rol: "admin"
            }
            return res.redirect("/profile")
        }

        let user = await userModel.findOne({ email: email })

        if (!user) return res.status(400).send({ status: "error", error: "usuario no encontrado" })

        if (password != user.password) {
            return res.status(400).send("Contraseña incorrecta.")
        }

        req.session.user = user

        res.redirect("/profile")

    } catch (error) {
        res.status(500).send("Error de Login")
    }
});

module.exports = router;


