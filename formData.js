const mongoose = require("mongoose");

//creates schema to store new patients form data posted
module.exports.formSchema = new mongoose.Schema({
  name: String,
  address: String,
  agesex: String,
  datetime: String,
  clinicalWorkup: {
    complains: [{
      Slno: Number,
      Eye: String,
      Description: String,
      Duration: String,
      Onset: String,
      Current: String
    }],
    histories: [{
      Slno: Number,
      Ocular: String,
      Medical: String
    }],
    vision: {
      EyeOD: String,
      GlassODDistance: String,
      GlassODNear: String,
      GlassODNearDist: String,
      ODDistance: String,
      ODNear: String,
      ODNearDist: String,
      EyeOS: String,
      GlassOSDistance: String,
      GlassOSNear: String,
      GlassOSNearDist: String,
      OSDistance: String,
      OSNear: String,
      OSNearDist: String
    },
    pgp: {
      EyeOD: String,
      ODSpherical: String,
      ODCylinder: String,
      ODAxis: String,
      ODAddition: String,
      EyeOS: String,
      OSSpherical: String,
      OSCylinder: String,
      OSAxis: String,
      OSAddition: String
    },
    retinoscopy: {
      EyeOD: String,
      ODSpherical: String,
      ODClinder: String,
      ODAxis: String,
      EyeOS: String,
      OSSpherical: String,
      OSCylinder: String,
      OSAxis: String
    },
    ocular: {
      EyeOD: String,
      ODDescription: String,
      EyeOS: String,
      OSDescription: String
    },
    sle: {
      Input1: String,
      Input2: String,
      Input3: String,
      Input4: String
    },
    intraocular: {
      Method: String,
      OD: String,
      OS: String,
      Time: String
    },
    gonioscopy: {
      Input11: String,
      Input12: String,
      Input21: String,
      Input22: String,
      Input23: String,
      Input24: String,
      Input31: String,
      Input32: String
    },
    fundus: {
      Input1: String,
      Input2: String,
      Input3: String,
      Input4: String
    },
    investigations: [{
      Slno: String,
      Name: String
    }],
    diagnoses: [{
      Slno: String,
      Eye: String,
      Description: String
    }]
  },
  rxp: [{
    Slno: String,
    Eye: String,
    Drug: String,
    Dose: String,
    Duration: String,
    StartDate: String,
    EndDate: String
  }],
  gp: {
    DVrightSPH: String,
    DVrightCYL: String,
    DVrightAXIS: String,
    DVrightVA: String,
    DVleftSPH: String,
    DVleftCYL: String,
    DVleftAXIS: String,
    DVleftVA: String,
    NVrightSPH: String,
    NVrightCYL: String,
    NVrightAXIS: String,
    NVrightVA: String,
    NVleftSPH: String,
    NVleftCYL: String,
    NVleftAXIS: String,
    NVleftVA: String
  }
});

//saves patient data submitted through form post to database
module.exports.saveForm =  function(Model, formData){
  const newPatient = new Model({
    name: formData.fullname,
    address: formData.address,
    agesex: formData.agesex,
    datetime: formData.datetime
  });
  //clinicalWorkup complains
  if (Array.isArray(formData.complainSl)) {
    for (var i = 0; i < formData.complainSl.length; i++) {
      const complainItem = {
        Slno: formData.complainSl[i],
        Eye: formData.complainEye[i],
        Description: formData.complainDescription[i],
        Duration: formData.complainDuration[i],
        Onset: formData.complainOnset[i],
        Current: formData.complainCurrent[i]
      };
      newPatient.clinicalWorkup.complains.push(complainItem);
    }
  } else {
    newPatient.clinicalWorkup.complains.push({
      Slno: formData.complainSl,
      Eye: formData.complainEye,
      Description: formData.complainDescription,
      Duration: formData.complainDuration,
      Onset: formData.complainOnset,
      Current: formData.complainCurrent
    });
  }
  //clinicalWorkup histories
  if (Array.isArray(formData.historySl)) {
    for (var i = 0; i < formData.historySl.length; i++) {
      const historyItem = {
        Slno: formData.historySl[i],
        Ocular: formData.historyOcularHistory[i],
        Medical: formData.historyMedicalHistory[i]
      };
      newPatient.clinicalWorkup.histories.push(historyItem);
    }
  } else {
    newPatient.clinicalWorkup.histories.push({
      Slno: formData.historySl,
      Ocular: formData.historyOcularHistory,
      Medical: formData.historyMedicalHistory
    });
  }
//clinicalWorkup visions
newPatient.clinicalWorkup.vision = {
  EyeOD: formData.visionGlassODEye,
  GlassODDistance: formData.visionGlassODDistance,
  GlassODNear: formData.visionGlassODNear,
  GlassODNearDist: formData.visionGlassODNearDist,
  ODDistance: formData.visionODDistance,
  ODNear: formData.visionODNear,
  ODNearDist: formData.visionODNearDist,
  EyeOS: formData.visionGlassOSEye,
  GlassOSDistance: formData.visionGlassODDistance,
  GlassOSNear: formData.visionGlassOSNear,
  GlassOSNearDist: formData.visionGlassOSNearDist,
  OSDistance: formData.visionOSDistance,
  OSNear: formData.visionOSNear,
  OSNearDist: formData.visionOSNearDist
};
//clinicalWorkup pgp(previous glass prescription)
newPatient.clinicalWorkup.pgp= {
  EyeOD: formData.pgpODEye,
  ODSpherical: formData.pgpODSpherical,
  ODCylinder: formData.pgpODCylinder,
  ODAxis: formData.pgpODAxis,
  ODAddition: formData.pgpODAddition,
  EyeOS: formData.pgpOSEye,
  OSSpherical: formData.pgpOSSpherical,
  OSCylinder: formData.pgpOSCylinder,
  OSAxis: formData.pgpOSAxis,
  OSAddition: formData.pgpOSAddition
};
//clinicalWorkup retinoscopy
newPatient.clinicalWorkup.retinoscopy= {
  EyeOD: formData.retinoscopyODEye,
  ODSpherical: formData.retinoscopyODSpherical,
  ODClinder: formData.retinoscopyODClinder,
  ODAxis: formData.retinoscopyODAxis,
  EyeOS: formData.retinoscopyOSEye,
  OSSpherical: formData.retinoscopyOSSpherical,
  OSCylinder: formData.retinoscopyOSCylinder,
  OSAxis: formData.retinoscopyOSAxis
};
//clinicalWorkup ocular motility
newPatient.clinicalWorkup.ocular= {
  EyeOD: formData.ocularODEye,
  ODDescription: formData.ocularODDescription,
  EyeOS: formData.ocularOSEye,
  OSDescription: formData.ocularOSDescription
};
//clinicalWorkup slit lamp examination
newPatient.clinicalWorkup.sle= {
  Input1: formData.slitInput1,
  Input2: formData.slitInput2,
  Input3: formData.slitInput3,
  Input4: formData.slitInput4
};
//clinicalWorkup intraocular pressure
newPatient.clinicalWorkup.intraocular= {
  Method: formData.intraocularMethod,
  OD: formData.intraocularOD,
  OS: formData.intraocularOS,
  Time: formData.intraocularTime
};
//clinicalWorkup gonioscopy
newPatient.clinicalWorkup.gonioscopy = {
  Input11: formData.gonioscopyInput11,
  Input12: formData.gonioscopyInput12,
  Input21: formData.gonioscopyInput21,
  Input22: formData.gonioscopyInput22,
  Input23: formData.gonioscopyInput23,
  Input24: formData.gonioscopyInput24,
  Input31: formData.gonioscopyInput31,
  Input32: formData.gonioscopyInput32
};
//clinicalWorkup fundus
newPatient.clinicalWorkup.fundus = {
  Input1: formData.fundusInput1,
  Input2: formData.fundusInput2,
  Input3: formData.fundusInput3,
  Input4: formData.fundusInput4
};
//clinicalWorkup investigation
if (Array.isArray(formData.investigationSl)) {
  for (var i = 0; i < formData.investigationSl.length; i++) {
    const investigationItem = {
      Slno: formData.investigationSl[i],
      Name: formData.investigationName[i]
    };
    newPatient.clinicalWorkup.investigations.push(investigationItem);
  }
} else {
  newPatient.clinicalWorkup.investigations.push({
    Slno: formData.investigationSl,
    Name: formData.investigationName
  });
}
//clinicalWorkup diagnosis
if (Array.isArray(formData.diagnosisSl)) {
  for (var i = 0; i < formData.diagnosisSl.length; i++) {
    const diagnosisItem = {
      Slno: formData.diagnosisSl[i],
      Eye: formData.diagnosisEye[i],
      Description: formData.diagnosisDescription[i]
    };
    newPatient.clinicalWorkup.diagnoses.push(diagnosisItem);
  }
} else {
  newPatient.clinicalWorkup.diagnoses.push({
    Slno: formData.diagnosisSl,
    Eye: formData.diagnosisEye,
    Description: formData.diagnosisDescription
  });
}
//drug prescription (rx)
if(Array.isArray(formData.rxpSl)){
  for(var i=0; i<formData.rxpSl.length; i++){
    const rxpItem = {
    Slno: formData.rxpSl[i],
    Eye: formData.rxpEye[i],
    Drug: formData.rxpDrug[i],
    Dose: formData.rxpDose[i],
    Duration: formData.rxpDuration[i],
    StartDate: formData.rxpStartDate[i],
    EndDate: formData.rxpEndDate[i]
    }
    newPatient.rxp.push(rxpItem);
  }
}else{
    newPatient.rxp.push({
    Slno: formData.rxpSl,
    Eye: formData.rxpEye,
    Drug: formData.rxpDrug,
    Dose: formData.rxpDose,
    Duration: formData.rxpDuration,
    StartDate: formData.rxpStartDate,
    EndDate: formData.rxpEndDate
  });
}
//glass prescription
newPatient.gp = {
DVrightSPH: formData.gpDVrightSPH,
DVrightCYL: formData.gpDVrightCYL,
DVrightAXIS: formData.gpDVrightAXIS,
DVrightVA: formData.gpDVrightVA,
DVleftSPH: formData.gpDVleftSPH,
DVleftCYL: formData.gpDVleftCYL,
DVleftAXIS: formData.gpDVleftAXIS,
DVleftVA: formData.gpDVleftVA,
NVrightSPH: formData.gpNVrightSPH,
NVrightCYL: formData.gpNVrightCYL,
NVrightAXIS: formData.gpNVrightAXIS,
NVrightVA: formData.gpNVrightVA,
NVleftSPH: formData.gpNVleftSPH,
NVleftCYL: formData.gpNVleftCYL,
NVleftAXIS: formData.gpNVleftAXIS,
NVleftVA: formData.gpNVleftVA
}

//save newPatient in db
  newPatient.save();
}
