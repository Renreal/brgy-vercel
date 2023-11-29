      // Get a reference to the "Account Transaction" button
      const dashboardButton = document.querySelector('.Dashboard'); // Use the class name

      // Add an event listener to the button
      dashboardButton.addEventListener('click', () => {
        // Redirect to dashboard.html
        window.location.href = 'dashboard.html';
      });
      