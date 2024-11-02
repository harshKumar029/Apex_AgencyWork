// src/ImportData.jsx

import React, { useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const ImportData = () => {
  useEffect(() => {
    const importData = async () => {
      // Services data
      const servicesData = [
        {
          serviceId: 'creditCard',
          name: 'Credit Card',
          banks: [
            'hdfcBank',
            'indusBank',
            'rblBank',
            'standardChartered',
            'hsbcBank',
            'idfcFirstBank',
            'yesBank',
            'sbiBank',
            'auBank',
            'americanExpress',
            'iciciBank',
            'axisBank',
            'kotakMahindraBank',
            'bobBank',
          ],
        },
        {
          serviceId: 'personalLoan',
          name: 'Personal Loan',
          banks: [
            'hdfcBank',
            'indusBank',
            'rblBank',
            'standardChartered',
            'hsbcBank',
            'idfcFirstBank',
            'yesBank',
            'sbiBank',
            'auBank',
            'americanExpress',
            'iciciBank',
            'axisBank',
            'kotakMahindraBank',
            'bobBank',
          ],
        },
        {
          serviceId: 'homeLoan',
          name: 'Home Loan',
          banks: [
            'hdfcBank',
            'indusBank',
            'rblBank',
            'standardChartered',
            'hsbcBank',
            'idfcFirstBank',
            'yesBank',
            'sbiBank',
            'auBank',
            'americanExpress',
            'iciciBank',
            'axisBank',
            'kotakMahindraBank',
            'bobBank',
          ],
        },
        {
          serviceId: 'carLoan',
          name: 'Car Loan',
          banks: [
            'hdfcBank',
            'indusBank',
            'rblBank',
            'standardChartered',
            'hsbcBank',
            'idfcFirstBank',
            'yesBank',
            'sbiBank',
            'auBank',
            'americanExpress',
            'iciciBank',
            'axisBank',
            'kotakMahindraBank',
            'bobBank',
          ],
        },
        {
          serviceId: 'magnetCard',
          name: 'Magnet Card',
          banks: [
            'hdfcBank',
            'indusBank',
            'rblBank',
            'standardChartered',
            'hsbcBank',
            'idfcFirstBank',
            'yesBank',
            'sbiBank',
            'auBank',
            'americanExpress',
            'iciciBank',
            'axisBank',
            'kotakMahindraBank',
            'bobBank',
          ],
        },
        {
          serviceId: 'insurance',
          name: 'Insurance',
          banks: [
            'hdfcBank',
            'indusBank',
            'rblBank',
            'standardChartered',
            'hsbcBank',
            'idfcFirstBank',
            'yesBank',
            'sbiBank',
            'auBank',
            'americanExpress',
            'iciciBank',
            'axisBank',
            'kotakMahindraBank',
            'bobBank',
          ],
        },
        {
          serviceId: 'loanAgainstProperty',
          name: 'Loan Against Property',
          banks: [
            'hdfcBank',
            'indusBank',
            'rblBank',
            'standardChartered',
            'hsbcBank',
            'idfcFirstBank',
            'yesBank',
            'sbiBank',
            'auBank',
            'americanExpress',
            'iciciBank',
            'axisBank',
            'kotakMahindraBank',
            'bobBank',
          ],
        },
        {
          serviceId: 'businessLoan',
          name: 'Business Loan',
          banks: [
            'hdfcBank',
            'indusBank',
            'rblBank',
            'standardChartered',
            'hsbcBank',
            'idfcFirstBank',
            'yesBank',
            'sbiBank',
            'auBank',
            'americanExpress',
            'iciciBank',
            'axisBank',
            'kotakMahindraBank',
            'bobBank',
          ],
        },
        {
          serviceId: 'bankAccount',
          name: 'Bank Account',
          banks: [
            'hdfcBank',
            'indusBank',
            'rblBank',
            'standardChartered',
            'hsbcBank',
            'idfcFirstBank',
            'yesBank',
            'sbiBank',
            'auBank',
            'americanExpress',
            'iciciBank',
            'axisBank',
            'kotakMahindraBank',
            'bobBank',
          ],
        },
      ];

      // Banks data
      const banksData = [
        {
          bankId: 'hdfcBank',
          name: 'HDFC Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 200,
        },
        {
          bankId: 'indusBank',
          name: 'INDUS Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 400,
        },
        {
          bankId: 'rblBank',
          name: 'RBL Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 200,
        },
        {
          bankId: 'standardChartered',
          name: 'STANDARD CHARTERED',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 500,
        },
        {
          bankId: 'hsbcBank',
          name: 'HSBC Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 500,
        },
        {
          bankId: 'idfcFirstBank',
          name: 'IDFC First Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 300,
        },
        {
          bankId: 'yesBank',
          name: 'Yes Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 300,
        },
        {
          bankId: 'sbiBank',
          name: 'State Bank Of India',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 300,
        },
        {
          bankId: 'auBank',
          name: 'AU Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 300,
        },
        {
          bankId: 'americanExpress',
          name: 'American Express',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 300,
        },
        {
          bankId: 'iciciBank',
          name: 'ICICI Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 300,
        },
        {
          bankId: 'axisBank',
          name: 'AXIS Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 300,
        },
        {
          bankId: 'kotakMahindraBank',
          name: 'Kotak Mahindra Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 300,
        },
        {
          bankId: 'bobBank',
          name: 'BOB Bank',
          services: [
            'creditCard',
            'personalLoan',
            'homeLoan',
            'carLoan',
            'magnetCard',
            'insurance',
            'loanAgainstProperty',
            'businessLoan',
            'bankAccount',
          ],
          earningsPerLead: 300,
        },
      ];

      try {
        // Import services
        for (const service of servicesData) {
          const serviceRef = doc(db, 'services', service.serviceId);
          await setDoc(serviceRef, {
            name: service.name,
            banks: service.banks,
          });
          console.log(`Imported service: ${service.serviceId}`);
        }

        // Import banks
        for (const bank of banksData) {
          const bankRef = doc(db, 'banks', bank.bankId);
          await setDoc(bankRef, {
            name: bank.name,
            services: bank.services,
            earningsPerLead: bank.earningsPerLead,
          });
          console.log(`Imported bank: ${bank.bankId}`);
        }

        console.log('Data import completed successfully.');
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };

    importData();
  }, []);

  return (
    <div>
      <h1>Importing Data to Firestore...</h1>
      <p>Check the console for progress updates.</p>
    </div>
  );
};

export default ImportData;
