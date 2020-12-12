import productdb, { bulkcreate, getData, createEle,SortObj } from './Module.js';

let db = productdb('Productdb', {
    products: `++id,name,seller,price`
});

//input tags
const userid = document.getElementById('userid');
const proname = document.getElementById('proname');
const seller = document.getElementById('seller');
const price = document.getElementById('price');

//buttons
const btncreate = document.getElementById('btn-create');
const btnread = document.getElementById('btn-read');
const btnupdate = document.getElementById('btn-update');
const btndelete = document.getElementById('btn-delete');

btncreate.onclick = (event) => {
    let flag = bulkcreate(db.products, {
        name: proname.value,
        seller: seller.value,
        price: price.value
    });
    proname.value = seller.value = price.value = "";
    console.log(flag);

    // set id textbox value
    getData(db.products, data => {
        console.log("here I am printing the data", data);
        userid.value = data.id + 1 || 1;
    });
}
// event listerner for create button
btnread.onclick = table;



// create dynamic table
function table() {
    const tbody = document.getElementById("tbody");
    const notfound = document.getElementById("notfound");
    notfound.textContent = "";
    // remove all childs from the dom first
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }

    getData(db.products, (data, index) => {
        if (data) {
            createEle("tr", tbody, tr => {
                for (const value in data) {
                    createEle("td", tr, td => {
                        td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
                    });
                }
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fas fa-edit btnedit";
                        i.setAttribute(`data-id`, data.id);
                        // store number of edit buttons
                        i.onclick = editbtn;
                    });
                })
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fas fa-trash-alt btndelete";
                        i.setAttribute(`data-id`, data.id);
                        // store number of delete buttons
                        i.onclick = deletebtn;
                    });
                })
            });
        } else {
            notfound.textContent = "No record found in the database...!";
        }

    });
}


// button update
btnupdate.onclick = () => {
    const id = parseInt(userid.value || 0);
    if (id) {
        // call dexie update method
        db.products.update(id, {
            name: proname.value,
            seller: seller.value,
            price: price.value
        }).then((updated) => {
            // let get = updated ? `data updated` : `couldn't update data`;
             let get = updated ? true : false;

            // display message
            // let updatemsg = document.querySelector(".updatemsg");
            // getMsg(get, updatemsg);

            proname.value = seller.value = price.value = "";
            console.log(get);
        })
    } else {
        console.log(`Please Select id: ${id}`);
    }
}

// delete button
btndelete.onclick = () => {
    db.delete();
    db = productdb("Productdb", {
        products: `++id, name, seller, price`
    });
    db.open();
    table();
    textID(userid);
    // display message
    // let deletemsg = document.querySelector(".deletemsg");
    // getMsg(true, deletemsg);
}

const editbtn = (event) => {
    let id = parseInt(event.target.dataset.id);
    db.products.get(id, function (data) {
        let newdata = SortObj(data);
        userid.value = newdata.id || 0;
        proname.value = newdata.name || "";
        seller.value = newdata.seller || "";
        price.value = newdata.price || "";
    });
}

// delete icon remove element 
const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db.products.delete(id);
    table();
}

window.onload = event => {
    // set id textbox value
    textID(userid);
};
// textbox id
function textID(textboxid) {
    getData(db.products, data => {
        textboxid.value = data.id + 1 || 1;
    });
}