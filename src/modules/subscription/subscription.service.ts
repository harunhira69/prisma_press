import Stripe from "stripe"
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

const handleStripeWebhook = async(payload:Buffer,signature:string)=>{
      console.log("Webhook received");


    const endpointSecret = config.stripe_webhook_secret!;
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    )
    console.log(event.type);


      switch (event.type) {
    case 'checkout.session.completed':
    //   console.log(event.data.object)
   
      await handleCheckoutSession(event.data.object)

      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'customer.subscription.created':
    
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;

      case 'customer.source.deleted':

      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
        
    

}

const getPeriodEnd = (payload:Stripe.Subscription)=>{
const currentPeriodEndInMillSec = payload.items.data[0]?.current_period_end!;
       
      const  currentPeriodEnd = new Date(currentPeriodEndInMillSec * 1000)
     return currentPeriodEnd;

}

const handleCheckoutSession = async(session:Stripe.Checkout.Session)=>{

      const userId = session.metadata?.userId
      const stripeCustomerId = session.customer as string
      const stripeSubscriptionId = session.subscription as string;
      if(!userId||!stripeCustomerId||!stripeSubscriptionId){
        throw new Error("webhook failed");
        
      }

      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
      
     const currentPeriodEnd =  getPeriodEnd(stripeSubscription)
      

     await prisma.subscription.upsert({
        where:{
            userId
        },
        create:{
            userId,
            stripeCustomerId,
            stripeSubscriptionId,
            status:"ACTIVE",
           currentPeriodEnd 
        },
        update:{
      stripeCustomerId,
      stripeSubscriptionId,
      status:"ACTIVE",
      currentPeriodEnd
        }

     })

}

export const subscriptionService = {
    createCheckOut,
    handleStripeWebhook
}