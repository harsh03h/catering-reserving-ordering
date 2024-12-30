document.getElementById('reservation-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const eventName = document.getElementById('event-name').value;
  const eventDate = document.getElementById('event-date').value;
  const numGuests = document.getElementById('num-guests').value;

  // Store reservation details
  localStorage.setItem('reservation', JSON.stringify({ eventName, eventDate, numGuests }));
  
  // Switch to order section
  document.getElementById('reservation').style.display = 'none';
  document.getElementById('order').style.display = 'block';
});

document.getElementById('submit-order').addEventListener('click', function() {
  const selectedItems = [];
  let totalPrice = 0;
  
  // Get selected menu items
  document.querySelectorAll('.menu-item input:checked').forEach(item => {
    selectedItems.push({ name: item.dataset.name, price: parseInt(item.dataset.price) });
    totalPrice += parseInt(item.dataset.price);
  });

  if (selectedItems.length === 0) {
    alert("Please select at least one menu item!");
    return;
  }

  // Store the order
  const reservation = JSON.parse(localStorage.getItem('reservation'));
  const order = {
    eventName: reservation.eventName,
    eventDate: reservation.eventDate,
    numGuests: reservation.numGuests,
    items: selectedItems,
    totalPrice
  };

  // Send the order to the backend
  fetch('/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Show confirmation message
      document.getElementById('confirmation-message').innerHTML = `
        Order for "${order.eventName}" has been confirmed! Total: $${order.totalPrice}.
      `;
      document.getElementById('order').style.display = 'none';
      document.getElementById('confirmation').style.display = 'block';
    } else {
      alert('Failed to place order. Please try again!');
    }
  })
  .catch(error => console.error('Error:', error));
});

document.getElementById('back-to-reservation').addEventListener('click', function() {
  document.getElementById('reservation').style.display = 'block';
  document.getElementById('confirmation').style.display = 'none';
});
