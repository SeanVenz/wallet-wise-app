import emailjs from 'emailjs-com';

emailjs.init('EUnpkVzwYrJ66l5sU');

export const sendEmail = (student, template) => {
    const templateParams = {
      to_name: student.displayName,
      to_email: student.email // Recipient's name
      // You can add more variables here based on your email template
    };
  
    emailjs
      .send('service_1ivvhkh', template, templateParams)
      .then(
        function (response) {
          console.log('Approval email sent successfully!', response);
          // Now, you can also call your approveStudent function
        },
        function (error) {
          console.error('Approval email delivery failed', error);
        }
      );
  };