
export const formJSON = {
    "type": "form",
    "form": {
       "formId": "uuid-formId-1",
       "formLabel": "Upload Invoice",
       "formSection": {
          "formSectionId": "uuid-sectionId-1",
          "formSectionLabel": "Upload Invoice",
          "formId": "uuid-formId-1",
          "fields": [
             {
                "fieldId": "uuid-fieldId-1",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Engagement / Application / Phase",
                "apiFieldName": "Engagement",
                "labelPlacement": "centre",
                "type": "select",
                "id": "EegagementId",
                "isCascading": false,
                "childControl": [],
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "",
                "optionsData": [{
                   value: 1,
                   label: "Engagement 1"
                }, {
                   value: 2,
                   label: "Engagement 2"
                }, {
                   value: 3,
                   label: "Engagement 3"
                }, {
                   value: 4,
                   label: "Engagement 4"
                }],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 12,
                   "style": {
                      "marginTop": "5px"
                   }
                },
                "placeholder": "Select Engagement /Phase",
                "className": "",
                "isMandetory": true
             },
             {
                "fieldId": "uuid-fieldId-2",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Ticket",
                "apiFieldName": "Ticket",
                "labelPlacement": "centre",
                "type": "text",
                "id": "ticketId",
                "isCascading": true,
                "childControl": [],
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "",
                "optionsData": [
 
                ],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 6,
                   "style": {
                      "marginTop": "5px"
 
                   },
                   "className": "",
 
                },
                "placeholder": "",
                "className": "",
                "isMandetory": true
             },
             {
               "fieldId": "uuid-fieldId-5",
               "formId": "uuid-formId-1",
               "formSectionId": "uuid-sectionId-1",
               "label": "Description",
               "apiFieldName": "Description",
               "labelPlacement": "centre",
               "type": "textarea",
               "id": "descriptionId",
               "validations": {
                  "requiredValidation": {
                     "required": false,
                     "msg": ""
                  },
                  "regexValidation": {
                     "regex": "",
                     "msg": ""
                  }
               },
               "errorMsg": "",
               "value": "",
               "optionsData": [

               ],
               "action": "onChange",
               "actionApi": "",
               "colclass": {
                  "md": 12,
                  "style": {
                     "marginTop": "5px"
                  }
               },
               "placeholder": "Enter Description",
               "className": "",
               "isMandetory": true
            },
            {
               "fieldId": "uuid-fieldId-6",
               "formId": "uuid-formId-1",
               "formSectionId": "uuid-sectionId-1",
               "label": "Assigned To",
               "apiFieldName": "assignedto",
               "labelPlacement": "centre",
               "type": "select",
               "id": "assignedtoId",
               "validations": {
                  "requiredValidation": {
                     "required": false,
                     "msg": ""
                  },
                  "regexValidation": {
                     "regex": "",
                     "msg": ""
                  }
               },
               "errorMsg": "",
               "value": "",
               "optionsData": [{
                  value: 1,
                  label: "Resource 1"
               }, {
                  value: 2,
                  label: "Resource 2"
               }, {
                  value: 3,
                  label: "Resource 3"
               }, {
                  value: 4,
                  label: "Resource 4"
               }],
               "action": "onChange",
               "actionApi": "",
               "colclass": {
                  "md": 12,
                  "style": {
                     "marginTop": "5px"
                  }
               },
               "placeholder": "Select",
               "className": "",
               "isMandetory": true
            },
            {
               "fieldId": "uuid-fieldId-6",
               "formId": "uuid-formId-1",
               "formSectionId": "uuid-sectionId-1",
               "label": "Priority",
               "apiFieldName": "Priority",
               "labelPlacement": "centre",
               "type": "select",
               "id": "priorityId",
               "validations": {
                  "requiredValidation": {
                     "required": false,
                     "msg": ""
                  },
                  "regexValidation": {
                     "regex": "",
                     "msg": ""
                  }
               },
               "errorMsg": "",
               "value": "",
               "optionsData": [{
                  value: 1,
                  label: "Normal"
               }, {
                  value: 2,
                  label: "Urgent"
               }],
               "action": "onChange",
               "actionApi": "",
               "colclass": {
                  "md": 12,
                  "style": {
                     "marginTop": "5px"
                  },
                  "className": "col-6",
               },
               "placeholder": "Select",
               "isMandetory": true
            },
            {
               "fieldId": "uuid-fieldId-2",
               "formId": "uuid-formId-1",
               "formSectionId": "uuid-sectionId-1",
               "label": "Planned Hours",
               "apiFieldName": "PlannedHours",
               "labelPlacement": "centre",
               "type": "text",
               "id": "plannedHoursId",
               "isCascading": true,
               "childControl": [],
               "validations": {
                  "requiredValidation": {
                     "required": false,
                     "msg": ""
                  },
                  "regexValidation": {
                     "regex": "",
                     "msg": ""
                  }
               },
               "errorMsg": "",
               "value": "",
               "optionsData": [

               ],
               "action": "onChange",
               "actionApi": "",
               "colclass": {
                  "md": 6,
                  "style": {
                     "marginTop": "5px"

                  },
                  "className": "col-6",

               },
               "placeholder": "",
               "className": "",
               "isMandetory": true
            },
            {
               "fieldId": "uuid-fieldId-9",
               "formId": "uuid-formId-1",
               "formSectionId": "uuid-sectionId-1",
               "label": "Incident Date",
               "apiFieldName": "IncidentDate",
               "labelPlacement": "centre",
               "type": "date",
               "id": "incidentDateId",
               "validations": {
                  "requiredValidation": {
                     "required": false,
                     "msg": ""
                  },
                  "regexValidation": {
                     "regex": "",
                     "msg": ""
                  }
               },
               "errorMsg": "",
               "value": "",
               "optionsData": [

               ],
               "action": "onChange",
               "actionApi": "",
               "colclass": {
                  "md": 6,
                  "style": {
                     "marginTop": "5px",
                     "float": "left"
                  },
                  "className": "col-6",
               },
               "placeholder": "",

               "isMandetory": true
            },
            {
               "fieldId": "uuid-fieldId-9",
               "formId": "uuid-formId-1",
               "formSectionId": "uuid-sectionId-1",
               "label": "Reported date",
               "apiFieldName": "Reporteddate",
               "labelPlacement": "centre",
               "type": "date",
               "id": "startDateId",
               "validations": {
                  "requiredValidation": {
                     "required": false,
                     "msg": ""
                  },
                  "regexValidation": {
                     "regex": "",
                     "msg": ""
                  }
               },
               "errorMsg": "",
               "value": "",
               "optionsData": [

               ],
               "action": "onChange",
               "actionApi": "",
               "colclass": {
                  "md": 6,
                  "style": {
                     "marginTop": "5px",
                     "float": "left"
                  },
                  "className": "col-6",
               },
               "placeholder": "",

               "isMandetory": true
            },
             {
                "fieldId": "uuid-fieldId-3",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Requirement",
                "apiFieldName": "Requirement",
                "labelPlacement": "centre",
                "type": "text",
                "id": "requirementTextId",
                "isCascading": false,
                "childControl": [],
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "",
                "optionsData": [],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 12,
                   "style": {
                      "marginTop": "5px"
                   }
                },
                "placeholder": "",
                "className": "",
                "isMandetory": true
             },
             {
                "fieldId": "uuid-fieldId-4",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Task",
                "apiFieldName": "Task",
                "labelPlacement": "centre",
                "type": "text",
                "id": "taskId",
                "isCascading": false,
                "childControl": [
 
                ],
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "",
                "optionsData": [
 
                ],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 12,
                   "style": {
                      "marginTop": "5px"
                   }
                },
                "placeholder": "Enter Task",
                "className": "",
                "isMandetory": true
             },
             {
                "fieldId": "uuid-fieldId-5",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Description",
                "apiFieldName": "Description",
                "labelPlacement": "centre",
                "type": "textarea",
                "id": "descriptionId",
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "",
                "optionsData": [
 
                ],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 12,
                   "style": {
                      "marginTop": "5px"
                   }
                },
                "placeholder": "Enter Description",
                "className": "",
                "isMandetory": true
             },
             {
                "fieldId": "uuid-fieldId-6",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Assigned To",
                "apiFieldName": "assignedto",
                "labelPlacement": "centre",
                "type": "select",
                "id": "assignedtoId",
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "",
                "optionsData": [{
                   value: 1,
                   label: "Resource 1"
                }, {
                   value: 2,
                   label: "Resource 2"
                }, {
                   value: 3,
                   label: "Resource 3"
                }, {
                   value: 4,
                   label: "Resource 4"
                }],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 12,
                   "style": {
                      "marginTop": "5px"
                   }
                },
                "placeholder": "Select",
                "className": "",
                "isMandetory": true
             },
             {
                "fieldId": "uuid-fieldId-7",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Planned Hours",
                "apiFieldName": "plannedHours",
                "labelPlacement": "centre",
                "type": "text",
                "id": "plannedHoursId",
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "",
                "optionsData": [],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 6,
                   "style": {
                      "marginTop": "5px",
                      "float": "left"
                   },
                   "className": "col-6",
                },
                "placeholder": "Enter Planned Hours",
                "className": "",
                "isMandetory": true
             },
             {
                "fieldId": "uuid-fieldId-12",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Is Chargeable",
                "apiFieldName": "isChargeable",
                "labelPlacement": "centre",
                "type": "checkbox",
                "id": "isChargeableId",
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": {
                   "amount": "",
                   "typesOfCharges": ""
                },
                "optionsData": [],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 6,
                   "style": {
                      "marginTop": "5px",
                      "float": "left"
                   },
                   "className": "col-6",
                },
                "placeholder": "",
                "className": "",
                "isMandetory": false
             },
             {
                "fieldId": "uuid-fieldId-8",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Reason, if not chargeable",
                "apiFieldName": "notChargeableReason",
                "labelPlacement": "centre",
                "type": "select",
                "id": "notChargeableReasonId",
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "",
                "optionsData": [{
                   value: 1,
                   label: "Reason 1"
                }, {
                   value: 2,
                   label: "Reason 2"
                }, {
                   value: 3,
                   label: "Reason 3"
                }, {
                   value: 4,
                   label: "Reason 4"
                }],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 6,
                   "style": {
                      "marginTop": "5px"
                   }
 
                },
                "placeholder": "Select reason",
                "className": "",
                "isMandetory": true
             },
             {
                "fieldId": "uuid-fieldId-9",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Start Date",
                "apiFieldName": "startDate",
                "labelPlacement": "centre",
                "type": "date",
                "id": "startDateId",
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "",
                "optionsData": [
 
                ],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 6,
                   "style": {
                      "marginTop": "5px",
                      "float": "left"
                   },
                   "className": "col-6",
                },
                "placeholder": "",
 
                "isMandetory": true
             },
             {
                "fieldId": "uuid-fieldId-10",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "Complete by date",
                "apiFieldName": "completeByDate",
                "labelPlacement": "centre",
                "type": "date",
                "id": "completeByDateId",
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "",
                "optionsData": [
 
                ],
                "action": "onChange",
                "actionApi": "",
                "colclass": {
                   "md": 6,
                   "style": {
                      "marginTop": "5px",
                      "float": "left"
                   },
                   "className": "col-6",
                },
                "placeholder": "",
                "isMandetory": true
             },
 
 
             {
                "fieldId": "uuid-fieldId-14",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "",
                "apiFieldName": "submit",
                "labelPlacement": "centre",
                "type": "button",
                "id": "submitBtnId",
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "Submit",
                "optionsData": [
 
                ],
                "action": "onSubmitClick",
                "actionApi": "/api/Invoice/InsertUpdateInvoiceData",
                "colclass": {
                   "md": 2,
                   "style": {
                      "marginTop": "5px"
                   }
                },
                "condition": {
                   "isCascadingField": false,
                   "parentCascadingFields": [
 
                   ],
                   "fieldValuesGettingApi": "",
                   "fieldValuesGettingApiBody": {
 
                   },
                   "isConditionalField": false,
                   "ParentFieldIds": [
 
                   ]
                },
                "placeholder": "",
                "className": "btn btn-primary ml-1",
                "isMandetory": false
             },
             {
                "fieldId": "uuid-fieldId-15",
                "formId": "uuid-formId-1",
                "formSectionId": "uuid-sectionId-1",
                "label": "",
                "apiFieldName": "Reset",
                "type": "button",
                "validations": {
                   "requiredValidation": {
                      "required": false,
                      "msg": ""
                   },
                   "regexValidation": {
                      "regex": "",
                      "msg": ""
                   }
                },
                "errorMsg": "",
                "value": "Reset",
                "optionsData": [
 
                ],
                "action": "onResetClick",
                "actionApi": "",
                "colclass": {
                   "md": 2,
                   "style": {
                      "marginTop": "5px"
                   }
                },
                "condition": {
                   "isCascadingField": false,
                   "parentCascadingFields": [
 
                   ],
                   "fieldValuesGettingApi": "",
                   "fieldValuesGettingApiBody": {
 
                   },
                   "isConditionalField": false,
                   "ParentFieldIds": [
 
                   ]
                },
                "placeholder": "",
                "className": "btn btn-secondary",
                "isMandetory": false
             }
          ]
       }
    }
 }