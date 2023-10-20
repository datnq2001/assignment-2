import React, { useState, useEffect } from "react";
import './Phone.css';

function Phone(props) {
  const { contact, render, setRender } = props;
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phones, setPhones] = useState([]);
  const [showImage, setShowImage] = useState(false); // State for image overlay

  const host = "http://localhost:5000/api";

  const handleAddPhone = (contactId) => {
    if (name === "" || phoneNumber === "") {
      return;
    }

    fetch(`${host}/contacts/${contactId}/phones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phoneNumber, contactId }),
    })
      .then(() => {
        setRender(!render);
        setName("");
        setPhoneNumber("");
      })
      .catch((error) => console.error("Error adding phone:", error));
  };

  const handleDelete = (contactId, phoneId) => {
    fetch(`${host}/contacts/${contactId}/phones/${phoneId}`, {
      method: "DELETE",
    })
      .then(() => {
        setRender(!render);
        setShowImage(true); // Show the image overlay
        setTimeout(() => {
          setShowImage(false); // Hide the image after 5 seconds
        }, 5000);
      })
      .catch((error) => console.error("Error deleting phone:", error));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${host}/contacts/${contact.id}/phones`);
        const data = await response.json();
        setPhones(data);
      } catch (error) {
        console.error("Error fetching phones:", error);
      }
    };
    fetchData();
  }, [render]);

  return (
    <div className="mb-2">
      <div className="border-t-2 border-black p-1"></div>
      <div className="flex">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-2 border-black border-2"
          type="text"
          placeholder="Name"
        />
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="ms-1 px-2 border-black border-2"
          type="text"
          placeholder="Phone Number"
        />
        <button
          onClick={() => handleAddPhone(contact.id)}
          className="ms-1 px-2 rounded bg-green-500"
          style={{ backgroundColor: "#52D452" }}
        >
          Add
        </button>
      </div>
      <div className="mt-2" style={{ backgroundColor: "#C7CEEA" }}>
        <div className="flex">
          <div className="w-5/12 border-[1px] border-black">
            <div className="ms-2 my-1 font-semibold">Name</div>
          </div>
          <div className="w-5/12 border-[1px] border-black">
            <div className="ms-2 my-1 font-semibold">Number</div>
          </div>
          <div className="w-2/12 border-[1px] border-black">
            <div className="ms-2 my-1"></div>
          </div>
        </div>
        {phones.map((phone, index) => (
          <div key={index} className="flex">
            <div className="w-5/12 border-[1px] border-black">
              <div className="my-1 ms-2">{phone.name}</div>
            </div>
            <div className="w-5/12 border-[1px] border-black">
              <div className="my-1 ms-2">{phone.phoneNumber}</div>
            </div>
            <div className="flex justify-center w-2/12 border-[1px] border-black">
              <button
                onClick={() => handleDelete(contact.id, phone.id)}
                className="bg-red-500 px-1 my-1 rounded-sm"
                style={{ backgroundColor: "#FF6961" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Conditional rendering for the image overlay */}
      {showImage && (
        <div className="image-overlay">
          <img src="https://media.giphy.com/media/O2urDYbZDYMnoHUdUR/giphy.gif" alt="GIF" width="250" height="250" />
        </div>
      )}
    </div>
  );
}

export default Phone;
