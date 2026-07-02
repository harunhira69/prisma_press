import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"

const createCheckOut = async(userId:string)=>{

    const result = await prisma.$transaction(async(tx)=>{
        const user = await tx.user.findUniqueOrThrow({
            where:{
                id:userId
            },
            include:{
               subscriptions:true
            }
        })
 
    //    old subscriber already database e id store ase
       let stripeCustomerId  = user.subscriptions?.stripeCustomerId
     


       if(!stripeCustomerId){

        // new subscriber
          const customer = await stripe.customers.create({
            name:user.email,
            email:user.email,
            metadata:{
                userId:user.id

            }
        })

        stripeCustomerId = customer.id
       }


    const session = await stripe.checkout.sessions.create({
        line_items:[
            {
                price:config.stripe_price_id,
                quantity:1
            }
        ],
        mode:"subscription",
        customer:stripeCustomerId,
        payment_method_types:["card"],
        success_url:`${config.app_url}/premium?success=true`,
        cancel_url:`${config.app_url}/payment?success=false`,
        metadata:{
            userId:user.id

        }

        


    })  
    
    return session.url




      

        

    })
    return {
        paymentUrl:result
    }

}

export const subscriptionService = {
    createCheckOut
}