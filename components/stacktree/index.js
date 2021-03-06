import { useState } from 'react';

import Trace from './trace';
import Header from './header';
import Popup from './popup';
import firebase from '../../lib/db';

const StackTree = ({ data }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const db = firebase.firestore();

    const popupProps = {
        title,
        description,
        onCancel: () => setIsPopupOpen(false),
        onTitleChange: e => setTitle(e.target.value),
        onDescrptionChange: e => setDescription(e.target.value),
    };

    const addNewTrace = () => {
        if (title === '' || description === '') return;
        setIsPopupOpen(false);
        try {
            db.collection('stack').add({
                title,
                description,
                timestamp: new Date().toString(),
                completed: 'not completed',
            });
        } catch (err) {
            console.log('something went wrong');
        }
        setTitle('');
        setDescription('');
    };

    const markAsCompleteHandler = id => {
        try {
            const response = db.collection('stack').doc(id);
            response
                .update({ completed: 'completed' })
                .then(() => {})
                .catch(err => console.log(err));
        } catch (err) {}
    };

    const markAsIncompleteHandler = id => {
        try {
            const response = db.collection('stack').doc(id);
            response
                .update({ completed: 'not completed' })
                .then(() => {})
                .catch(err => console.log(err));
        } catch (err) {}
    };

    return (
        <div className="pt-2 min-h-screen sm:w-full md:w-11/12 mx-auto bg-gray-100">
            <Header data={data} openPopup={() => setIsPopupOpen(true)} />
            <div className="sm:w-full md:w-11/12 py-4  mx-auto">
                <div className="text-gray-700">Due Today</div>
                {data.length === 0 ? (
                    <Trace description="None" disabled />
                ) : (
                    data.map((todo, index) => (
                        <Trace
                            {...todo}
                            key={todo.id}
                            id={todo.id}
                            index={index}
                            length={data.length}
                            markAsComplete={markAsCompleteHandler}
                            markAsIncomplete={markAsIncompleteHandler}
                        />
                    ))
                )}
            </div>
            {isPopupOpen && <Popup {...popupProps} onAdd={addNewTrace} />}
        </div>
    );
};

export default StackTree;
