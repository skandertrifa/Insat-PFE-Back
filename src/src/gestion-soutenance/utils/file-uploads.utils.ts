import { extname } from 'path';

//Rapport PFE 
export const editFileNameRapporPfe = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(6)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  };

export const rapportPfeFileFilter = (req, file, callback) => {
if (file.mimetype!="application/pdf") {
    req.fileValidationError = 'Seulement le fichiers pdf sont acceptés';
    return callback(null, false);
}
callback(null, true);
};

//students File
export const editFileNameStudents = (req, file, callback) => {
    const fileExtName = extname(file.originalname);
    callback(null, `students${fileExtName}`);
  };

export const studentsFileFilter = (req, file, callback) => {
    // Only Excel fiels are accepted
    if (file.mimetype!="application/vnd.ms-excel" &&
        file.mimetype!="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        req.fileValidationError = 'Seulment les ficheirs excel sont acceptés';
        return callback(null, false);
    }
    callback(null, true);
};


//teachers File
export const editFileNameTeachers = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  callback(null, `teachers${fileExtName}`);
};

export const teachersFileFilter = (req, file, callback) => {
  // Only Excel fiels are accepted
  if (file.mimetype!="application/vnd.ms-excel" &&
      file.mimetype!="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      req.fileValidationError = 'Seulment les ficheirs excel sont acceptés';
      return callback(null, false);
  }
  callback(null, true);
};



//Fiche Proposition
export const editFichePropositionpfe = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(6)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const fichePropositionPfeFileFilter = (req, file, callback) => {
if (file.mimetype!="application/pdf") {
  req.fileValidationError = 'Seulement les fichiers pdf sont acceptés';
  return callback(null, false);
}
callback(null, true);
};
