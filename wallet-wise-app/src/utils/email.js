import emailjs from 'emailjs-com';

emailjs.init('PHfqcFObIRZdMxJDw');

export const sendEmail = (student, template) => {
    const templateParams = {
      to_name: student.displayName,
      to_email: student.email 
    };
  
    emailjs
      .send('service_1ivvhkh', template, templateParams)
      .then(
        function (response) {
          console.log('Approval email sent successfully!', response);
        },
        function (error) {
          console.error('Approval email delivery failed', error);
        }
      );
  };