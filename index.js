const Alexa = require('ask-sdk-core')
const axios = require('axios')
const skillBuilder = Alexa.SkillBuilders.custom()

async function getSuggestion() {
    const response = await axios.get(`http://www.boredapi.com/api/activity/`)
    return response.data.activity
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(handlerInput) {


        return handlerInput.responseBuilder
            .speak('Are you looking for somethign to do')
            .reprompt('Hello')
            .withShouldEndSession(false)
            .getResponse()
    },
}
const YesIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
    },

    async handle(handlerInput) {
        const activity = await getSuggestion()
        return handlerInput.responseBuilder
            .speak(activity)
            .reprompt('would you like a suggestion?')
            .withShouldEndSession(false)
            .getResponse()
    },
}
const ActivityIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ActivityIntent'
    },
    async handle(handlerInput) {
        const activity = await getSuggestion()
        const reprompt = 'Would you like another suggestion?'

        return handlerInput.responseBuilder
            .speak(activity + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}

const CancelAndStopIntenthandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .withShouldEndSession(true)
            .getResponse()
    },
}
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    },
    handle(handlerInput) {
        const guidance = 'We can provide suggestions for things to do!'
        const reprompt = 'Would you like another suggestion?'

        return handlerInput.responseBuilder
            .speak(guidance + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}
const FallBackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallBackIntent'
    },
    handle(handlerInput) {
        const guidance = 'say what?'
        const reprompt = 'Would you like another suggestion?'

        return handlerInput.responseBuilder
            .speak(guidance + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}
const NavigateHomeIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NavigateHomeIntentHandler'
    },
    handle(handlerInput) {
        const reprompt = 'Have fun!'

        return handlerInput.responseBuilder
            .speak(reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}
const ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("I'm sorry I didn't catch that. Can you repeat that?")
            .reprompt("I'm sorry I didn't catch that. Can you repeat that?")
            .withShouldEndSession(false)
            .getResponse()
    },
}



exports.handler = skillBuilder
    .addRequestHandlers(
        ActivityIntentHandler,
        FallBackIntentHandler,
        CancelAndStopIntenthandler,
        HelpIntentHandler,
        NavigateHomeIntentHandler,
        LaunchRequestHandler,
        YesIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda()

