const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                 "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    titleTag.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = "";
    descTag.value = "";
    addBtn.innerText = "Adicionar"
    popupTitle.innerText = "Adicionar nova atividade"
    popupBox.classList.remove("show");
});

/*Criação de notas*/

function showNotes(){
    document.querySelectorAll(".note").forEach(note => note.remove());
    notes.forEach((note, index) => {
        let liTag = `<li class="note">
                        <div class="details">
                        <div class="liga-desliga">
                        <input type="checkbox" class="liga-desliga__checkbox" id="liga-desliga-${index}" onclick="toggleCheckbox(${index})" ${note.checked ? 'checked' : ""}>

                        </div>  
                            <p>${note.title}</p>
                            <span>${note.description} </span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Editar</li>
                                    <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Excluir</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);            
    });
}
showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId){
    let confirmDel = confirm("Você tem certeza que deseja deletar essa nota?");
    if (!confirmDel) return;
    notes.splice(noteId, 1);
    // Salva as notas no localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();       
}

function toggleCheckbox(noteId){
    notes[noteId].checked = !notes[noteId].checked
    console.log(notes[noteId].checked)
    localStorage.setItem("notes", JSON.stringify(notes));    
    showNotes();
}

function updateNote(noteId, title, desc) {
    isUpdate = true;
    updateId = noteId
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Editar"
    popupTitle.innerText = "Editar a atividade"
    console.log(noteId, title, desc);
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let noteTitle = titleTag.value,
    noteDesc = descTag.value;

    if(noteTitle || noteDesc){
        let dateObj = new Date(),
        month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();
        
        let noteInfo = {
            title: noteTitle, description: noteDesc, checked: false,
            date: `${day} de ${month} de ${year}`
        }
        if(!isUpdate){
            notes.push(noteInfo); // adiciona nova nota     
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo; // Editar nota especifica 
        }
     
       // Salva as notas no localStorage
       localStorage.setItem("notes", JSON.stringify(notes));
       closeIcon.click();
       showNotes();
    }
    
});
