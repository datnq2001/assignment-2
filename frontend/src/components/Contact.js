import React, { useState } from "react";
import Phone from "./Phone";

function Contact(props) {
  const { contact, render, setRender, setDeleteContactImage } = props;
  const [showPhone, setShowPhone] = useState(false);

  const host = "http://localhost:5000/api";

  const handleDelete = (id) => {
    fetch(`${host}/contacts/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setRender((render) => !render);
        // Set the deleteContactImage to show the temporary image
        setDeleteContactImage("https://media.giphy.com/media/AcM4RWQDHuq1UhNXjk/giphy.gif");
        setTimeout(() => {
          setDeleteContactImage(null); // Revert to the default image
        }, 5000);
      })
      .catch((error) => console.error("Error deleting contact:", error));
  };

  return (
    <div className="mb-2 flex w-full rounded border-2 border-black" style={{ backgroundColor: '#B5EAD7'}}>
      <div className="mx-2 w-full">
        <div className="my-1 flex justify-between" >
          <div onClick={() => setShowPhone(!showPhone)} className="flex-1 cursor-pointer">
            {contact.name}
          </div>
          <button onClick={() => handleDelete(contact.id)} className="bg-red-500 px-2 rounded-sm" style={{ backgroundColor: '#FF6961'}}>Delete</button>
        </div>
        {showPhone ? <Phone contact={contact} render={render} setRender={setRender} /> : <></>}
      </div>
    </div>
  );
}

export default Contact;
