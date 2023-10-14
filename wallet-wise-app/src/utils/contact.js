import emailjs from 'emailjs-com';

emailjs.init('Hwy3DTSecMURqGo0X');

export const sendEmail = (textarea, subject, name, email) => {
    const templateParams = {
      name: name,
      email: email,
      subject: subject,
      textarea: textarea
    };
  
    emailjs
      .send('service_7kzxz87', 'template_jt4nl7j', templateParams)
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
  