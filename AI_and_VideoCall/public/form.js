

window.onload = function() {
     onloadFunction();
};
var prescription_g;
function onloadFunction() {
    // var prescription = Backend se prescription leke aao
    var prescription = {
        "name": {"name": "yogesh"}, 
        "age": {"age": "22"}, 
        "gender": {"gender": "male"}, 
        "symptoms": {"Symptom 1": "loss of appetite","Symptom 2": "loss of appetite","Symptom 3": "loss of appetite"}, 
        "disease": {"disease": "breast cancer"}, 
        "advice": {"Advice 1": "Take bed rest"}, 
        "medication": {"Medication 1": {"Acetaminophen": {"dosage_frequency": "twice a day", "duration": "2 days", "dosage": "200mg"}},
        "Medication 2": {"Acetaminophen": {"dosage_frequency": "twice a day", "duration": "2 days", "dosage": "200mg"}}
        }};
    
    prescription = PRESCRIPTION
    prescription_g = PRESCRIPTION

    console.log(prescription);

    var nameNode = getNameNode(prescription);
    var ageNode = getAgeNode(prescription);
    var genderNode = getGenderNode(prescription);
    var symptomNode = getSymptomNode(prescription);
    var diseaseNode = getDiseaseNode(prescription);
    var medicationNode = getMedicationNode(prescription);
    var adviceNode = getAdviceNode(prescription);

    document.getElementById("dynamic-form").appendChild(nameNode);
    document.getElementById("dynamic-form").appendChild(ageNode);
    document.getElementById("dynamic-form").appendChild(genderNode);
    document.getElementById("dynamic-form").appendChild(symptomNode);
    document.getElementById("dynamic-form").appendChild(diseaseNode);
    document.getElementById("dynamic-form").appendChild(medicationNode);
    document.getElementById("dynamic-form").appendChild(adviceNode);
}

function getNameNode(prescription) {
    var nameNode = document.createElement("div");
    nameNode.classList+="form-group";
    
    var heading = document.createElement("h3");
    heading.innerHTML="Name";
    
    var input = document.createElement("input");
    input.classList+="form-control input-field";
    input.defaultValue=capitalize(prescription.name.name);
    input.id="name.name";
    
    nameNode.appendChild(heading);
    nameNode.appendChild(input);
    return nameNode;
}

function getAgeNode(prescription) {
    var node = document.createElement("div");
    node.classList+="form-group";
    
    var heading = document.createElement("h3");
    heading.innerHTML="Age";
    
    var input = document.createElement("input");
    input.classList+="form-control input-field";
    input.defaultValue=prescription.age.age;
    input.id="age.age";
    
    node.appendChild(heading);
    node.appendChild(input);
    return node;
}

function getGenderNode(prescription) {
    var node = document.createElement("div");
    node.classList+="form-group";
    
    var heading = document.createElement("h3");
    heading.innerHTML="Gender";
    
    var input = document.createElement("input");
    input.classList+="form-control";
    input.defaultValue=capitalize(prescription.gender.gender);
    input.id="gender.gender";
    
    node.appendChild(heading);
    node.appendChild(input);
    return node;
}

function getSymptomNode(prescription){
    var node = document.createElement("div");
    node.classList+="form-group";
    node.id="symptom-node";
    
    var heading = document.createElement("h3");
    heading.innerHTML="Symptoms";
    node.appendChild(heading);
    
    for(var i=0; i<Object.keys(prescription.symptoms).length; i+=1){
        var newId = "Symptom " + (i+1);
        var input = document.createElement("input");
        input.classList+="form-control input-field";
        input.defaultValue=prescription.symptoms[newId];
        console.log(newId);
        input.id="symptoms."+newId;
        node.appendChild(input);
    }

    var addSym = document.createElement("button");
    addSym.onclick = addSymField;
    addSym.id = "add-sym-btn";
    addSym.classList+="btn btn-add";
    addSym.innerHTML = "Add Symptom";
    node.appendChild(addSym);
    
    return node;
}

function addSymField() {
    var existingChildren = document.getElementById("symptom-node").childElementCount - 2;
    var newId = "Symptom " + (existingChildren + 1);
    var input = document.createElement("input");
    input.classList+="form-control input-field";
    console.log(newId);
    input.id="symptoms." + newId;
    insertAfter(input, document.getElementById("add-sym-btn").previousSibling);
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
function getDiseaseNode(prescription) {
    var node = document.createElement("div");
    node.classList+="form-group";
    
    var heading = document.createElement("h3");
    heading.innerHTML="Disease";
    
    var input = document.createElement("input");
    input.classList+="form-control input-field";
    input.defaultValue=prescription.disease.disease;
    input.id="disease.disease";
    
    node.appendChild(heading);
    node.appendChild(input);
    return node;
}

function getMedicationNode(prescription){
    var node = document.createElement("div");
    node.classList+="form-group";
    
    var heading = document.createElement("h3");
    heading.innerHTML="Medication";
    node.appendChild(heading);
    
    for(var i=0; i<Object.keys(prescription.medication).length; i+=1){
        var newId = "Medication " + (i+1);
        
        var inputName = document.createElement("input");
        inputName.classList+="form-control";
        var medicineName =Object.keys(prescription.medication[newId])[0];
        inputName.defaultValue = medicineName;
        inputName.id="medication."+newId;
        node.appendChild(inputName);

        var inputDosage = document.createElement("input");
        inputDosage.classList+="form-control";
        var medicineDosage = prescription.medication[newId][medicineName]["dosage"];
        inputDosage.defaultValue = medicineDosage;
        // inputDosadge.id
        node.appendChild(inputDosage);

        var inputDuration = document.createElement("input");
        inputDuration.classList+="form-control";
        var medicineDuration = prescription.medication[newId][medicineName]["duration"];
        inputDuration.defaultValue = medicineDuration;
        // inputDosadge.id
        node.appendChild(inputDuration);

        var inputDosageFrequency = document.createElement("input");
        inputDosageFrequency.classList+="form-control";
        var medicineDosageFrequency = prescription.medication[newId][medicineName]["dosage_frequency"];
        inputDosageFrequency.defaultValue = medicineDosageFrequency;
        // inputDosadge.id
        node.appendChild(inputDosageFrequency);

        node.appendChild(document.createElement("br"));

    }
    return node;
}

function getAdviceNode(prescription){
    var node = document.createElement("div");
    node.classList+="form-group";
    
    var heading = document.createElement("h3");
    heading.innerHTML="Advices";
    node.appendChild(heading);
    
    for(var i=0; i<Object.keys(prescription.advice).length; i+=1){
        var newId = "Advice " + (i+1);
        var input = document.createElement("input");
        input.classList+="form-control input-field";
        input.defaultValue=prescription.advice[newId];
        console.log(newId);
        input.id="advice." + newId;
        node.appendChild(input);
    }
    return node;
}

function capitalize(str) {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
  }

document.addEventListener('input',function(e){
    if(e.target && e.target.classList.contains('input-field')){
          var id = e.target.id;
          var idArr = id.split(".");
          var halfpath = "";
          for(var p of idArr){
              halfpath += "[" + "'" +  p + "'" + "]";
          }
          var path = "prescription_g" + halfpath;

          eval(path + " = " + "'" + e.target.value + "'");
          console.log(prescription_g);
    }
});