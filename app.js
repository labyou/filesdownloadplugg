import firebase from 'firebase/app';
import 'firebase/storage'
import { upload } from './upload.js';

const firebaseConfig = {
    apiKey: "AIzaSyAtWGKvEB9NSCtJ6L9-sTdKu61KcD9lScg",
    authDomain: "frontend-upload-b4e47.firebaseapp.com",
    projectId: "frontend-upload-b4e47",
    storageBucket: "frontend-upload-b4e47.appspot.com",
    messagingSenderId: "941139481571",
    appId: "1:941139481571:web:954f8f4165d8a0341ec6d6"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) { 
        files.forEach((file, index) => { 
            const ref = storage.ref(`images/${file.name}`);
            const task = ref.put(file);
            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
                const block = blocks[index].querySelector('.preview_info_progress');
                block.textContent = percentage;
                block.style.width = percentage;
            }, error => { 
                console.log(error);
            }, completed => {
                task.snapshot.ref.getDownloadURL().then(url => { 
                    console.log('Download URL', url);
                })
            })
        })
    }
});