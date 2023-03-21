import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id

        const result = accounts.find((account) => account.id === id)

        if(!result){
            res.status(404)
            throw new Error("Conta não encontrada verifique o id")
        }
        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
    }

})

app.delete("/accounts/:id", (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const accountIndex = accounts.findIndex((account) => account.id === id)

        if(id[0] !== "a"){
            res.status(400)
            throw new Error("Id inválido, deve iniciar com a letra a");
        }
    
        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1)
        }
    
        res.status(200).send("Item deletado com sucesso")
        
    } catch (error: any) {
        console.log(error)
        if(res.statusCode === 200){
            res.status(500).send(error.message)
        }
    }


   
})

app.put("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

    const newId = req.body.id as string | undefined
    const newOwnerName = req.body.ownerName as string | undefined
    const newBalance = req.body.balance as number | undefined
    const newType = req.body.type as ACCOUNT_TYPE | undefined

    const account = accounts.find((account) => account.id === id)

    if( newId !== undefined){
        if(id[0] !== "a"){
            res.status(400)
            throw new Error("Id inválido, deve iniciar com a letra a");
        }

    }

    if(newOwnerName !== undefined){
        if(newOwnerName.length < 2){
            res.status(400)
            throw new Error("O nome deve ter dois ou mais caracteres");
            
        }
    }

    if(newBalance !== undefined){
        if(typeof newBalance !== "number" ){
            res.status(400)
            throw new Error("Balance precisa ser um número");   
        }

        if(newBalance < 0){
            res.status(400)
            throw new Error("O valor do balance precisa ser maior ou igual a zero");   
        }

        if(newType !== undefined){
            if(newType !== ACCOUNT_TYPE.GOLD &&
                newType !== ACCOUNT_TYPE.PLATINUM &&
                newType !== ACCOUNT_TYPE.BLACK){
                   res.status(400)
                   throw new Error("O valor passado deve ser um desses: Ouro, Platina ou Black");
                }
        }

    }

    if (account) {
        account.id = newId || account.id
        account.ownerName = newOwnerName || account.ownerName
        account.type = newType || account.type

        account.balance = isNaN(newBalance) ? account.balance : newBalance
    }

    res.status(200).send("Atualização realizada com sucesso")
    } catch (error: any) {
        console.log(error)
        if(res.statusCode === 200){
            res.status(500).send(error.message)
        }
    }
})