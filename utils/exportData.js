const fs = require('fs');

const Button = require('./../models/buttonModel');
const CallHistory = require('./../models/callHistoryModel');
const Care = require('./../models/careModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');
const Collaborator = require('./../models/collaboratorModel');
const Function = require('./../models/functionModel');
const RoomIntercom = require('./../models/roomIntercomModel');
const ServiceIntercom = require('./../models/serviceIntercomModel');
const Service = require('./../models/serviceModel');
const VirtualService = require('./../models/virtualServiceModel');

let date;

module.exports = async (req, res) => {
    date = Date.now();

    let button = await Button.find();
    let dataButton = JSON.stringify(button);

    let callHistory = await CallHistory.find();
    let dataCallHistory = JSON.stringify(callHistory);

    let care = await Care.find();
    let dataCare = JSON.stringify(care);

    let collaboratorHistory = await CollaboratorHistory.find();
    let dataCollaboratorHistory = JSON.stringify(collaboratorHistory);

    let collaborator = await Collaborator.find();
    let dataCollaborator = JSON.stringify(collaborator);

    let functions = await Function.find();
    let dataFunctions = JSON.stringify(functions);

    let roomIntercom = await RoomIntercom.find();
    let dataRoomIntercom = JSON.stringify(roomIntercom);

    let serviceIntercom = await ServiceIntercom.find();
    let dataServiceIntercom = JSON.stringify(serviceIntercom);

    let service = await Service.find();
    let dataService = JSON.stringify(service);

    let virtualService = await VirtualService.find();
    let dataVirtualService = JSON.stringify(virtualService);

    fs.writeFile('./data/button_' + date + '.json', dataButton, function (err) {
        if (err) throw err;
    });

    fs.writeFile('./data/callHistory_' + date + '.json', dataCallHistory, function (err) {
        if (err) throw err;
    });

    fs.writeFile('./data/care_' + date + '.json', dataCare, function (err) {
        if (err) throw err;
    });

    fs.writeFile('./data/collaboratorHistory_' + date + '.json', dataCollaboratorHistory, function (err) {
        if (err) throw err;
    });

    fs.writeFile('./data/collaborator_' + date + '.json', dataCollaborator, function (err) {
        if (err) throw err;
    });

    fs.writeFile('./data/function_' + date + '.json', dataFunctions, function (err) {
        if (err) throw err;
    });

    fs.writeFile('./data/roomIntercom_' + date + '.json', dataRoomIntercom, function (err) {
        if (err) throw err;
    });

    fs.writeFile('./data/serviceIntercom_' + date + '.json', dataServiceIntercom, function (err) {
        if (err) throw err;
    });

    fs.writeFile('./data/service_' + date + '.json', dataService, function (err) {
        if (err) throw err;
    });

    fs.writeFile('./data/virtualService_' + date + '.json', dataVirtualService, function (err) {
        if (err) throw err;
    });
}