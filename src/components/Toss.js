import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Toss = ({ tossObj, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newToss, setNewToss] = useState(tossObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this toss?");
    if (ok) {
      await dbService.doc(`tosses/${tossObj.id}`).delete();
      await storageService.refFromURL(tossObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => setIsEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`tosses/${tossObj.id}`).update({
      text: newToss,
    });
    setIsEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewToss(value);
  };
  return (
    <div className="toss">
      {isEditing ? (
        <>
          <form onSubmit={onSubmit} className="container tossEdit">
            <input
              type="text"
              placeholder="Edit your Toss"
              value={newToss}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Toss" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <div>
          <h4>{tossObj.text}</h4>
          <p className="toss__image">
            {tossObj.attachmentUrl && <img src={tossObj.attachmentUrl} />}
          </p>
          {isOwner && (
            <div className="toss__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Toss;
