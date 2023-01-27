const letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

let http = require("http");

let path = require("path");

let fs = require("fs");

const port = "3000";



// DISABLE THIS hostname FOR INTRANET USE

const hostname = "localhost";



//ENABLE THIS ip AND hostname FOR INTRANET USE

//var ip = require("ip");

//const hostname = ip.address();



let time_connect;

let phantom_time = [];

let skip_time = [];

let time_p2;

let sendInterval = 1000;

function sendServerSendEvent(req, res) {

 res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
res.setHeader('Access-Control-Max-Age', 2592000);

 res.writeHead(200, {

    "Content-Type" : "text/event-stream",
    "Cache-Control" : "no-cache",
    "Connection" : "keep-alive"
 });

 let sseId = (new Date()).toLocaleTimeString();

 setInterval(function() {

    let sse = {

        "id":false,
        "method":"update",
        "data":false
    }

    fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err, data) => {

                            if(!err){

                                try{

                                    sse.data = JSON.parse(data);

                                    writeServerSendEvent(res, sseId, sse);
                                }catch(err2){}
                            }
    });
 }, sendInterval);

 let sse2 = {

        "id":false,
        "method":"update",
        "data":false
    }

    fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err, data) => {

                            if(!err){

                                sse2.data = JSON.parse(data);

                                writeServerSendEvent(res, sseId, sse2);
                            }else{
                            
                                let logs = [[],[],0,[]];
                            
                                fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));    
                            }
    });
}

function skip_player(room_id, current_turn, change){

    fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

        if(!err1){
        
            let new_turn;
            let new_change;
            let finished_flag = true;

            logs = JSON.parse(data);
            
            if(logs[3]){
            
            logs[3].forEach((room)=>{

                if(room.room_id === room_id && room.current_turn === current_turn && room.change === change && !room.finished){
                
                    if(room.current_turn < (room.players.length-1)){
                                
                        room.current_turn++;
                        
                        new_turn = room.current_turn;
                    }else{
                                
                        room.current_turn = 0;
                        
                        new_turn = room.current_turn;
                    }
                    
                    room.last_turn = current_turn; 
                
                    room.change = guid();
                    
                    room.skipped = true;
                    
                    room.square_completed = false;
                    
                    new_change = room.change;
                    
                    room.first = false;
                    
                    finished_flag = false;
                }
            })
            
            if(!finished_flag){
            
            try {

                fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));
                
                    clearTimeout(skip_time[room_id]);
                
                    skip_time[room_id] = setTimeout(()=>{
                
                        skip_player(room_id, new_turn, new_change);
                    },8000);
            }catch(err) {
                
                    skip_player(room_id, current_turn, change);
            }
            
            }
            }
       
       }
    });    
}

async function phantom_rooms2(){

    fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

        if(!err1){
        
            let splice_index = -1;

            logs = JSON.parse(data);

            if(logs[3]){

                logs[3].forEach((room, index)=>{
            
                    if(room.new_players.length === 0){
                
                        splice_index = index;
                    }
                })
            
                if(splice_index !== -1){
            
                    logs[3].splice(splice_index, 1)
                
                    try {

                        fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));
                    
                        return true;
                    }catch(err){
                
                        return false;
                     }
                }else{
           
                    return true;
                }
           }
       }
    });             
}

async function phantom_rooms1(){

    fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

        if(!err1){

            logs = JSON.parse(data);

            if(logs[3]){

            logs[3].forEach((room)=>{
            
                let new_players = [];
            
                room.players.forEach((player)=>{
            
                        logs[1].forEach((user)=>{
                
                            if(user.user_id === player.user_id){
                            
                                new_players.push(user);
                            }
                        })
                })
                
                room.new_players = new_players;
                
                room.change = guid();
            })
            
                try {

                    fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));
                    
                    return true;
                }catch(err){
                
                    return false;
                }
           }
       }
    });             
}

function phantom_check(room_id, opt){

    fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

        if(!err1){

            logs = JSON.parse(data);

            logs[3].forEach((room)=>{
            
                if(opt === 1){
            
                if(room.room_id === room_id && !room.playing){

                let new_players = [];

                room.players.forEach((player)=>{

                    logs[1].forEach((user)=>{

                        if(player.user_id === user.user_id){

                            new_players.push(user);
                        }
                    })
                })
                
                let master_flag = false;
                
                new_players.forEach((person)=>{
                
                    if(room.master.user_id === person.user_id){
                        
                            master_flag = true;
                    }
                })
                
                    if(!master_flag && new_players.length > 0){
                
                        room.master = new_players[random_int(0, (new_players.length-1))];
                    }

                    room.players = new_players;

                    room.change = guid();
                
                }
                
                }else{
                
                    if(room.room_id === room_id){

                        let new_players = [];

                        room.players.forEach((player)=>{

                            logs[1].forEach((user)=>{

                                if(player.user_id === user.user_id){

                                    new_players.push(user);
                                }
                            })
                        })
                
                        let master_flag = false;
                
                        new_players.forEach((person)=>{
                
                            if(room.master.user_id === person.user_id){
                        
                                master_flag = true;
                            }
                        })
                
                        if(!master_flag && new_players.length > 0){
                
                            room.master = new_players[random_int(0, (new_players.length-1))];
                        }
                        
                        room.players = new_players;
                        
                        room.change = guid();
                    }    
                }
            })

            let result = false;

            while(!result){

                try {

                    fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                    result = true;
                }catch(err) {}
            }
        }
    });    
}

function random_int(min, max) {

    let floor = Math.ceil(min);
    let coil = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function guid(){

    return Math.round(Math.random() * 10000) + Math.round(Math.random() * 10000) + letters[random_int(0, 25)]; 
} 

function writeServerSendEvent(res, sseId, data) {

 res.write("id: " + sseId + "\n");
 res.write("data: " + JSON.stringify(data) + "\n\n");
}


http.createServer((request, response) => {

    response.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
response.setHeader('Access-Control-Max-Age', 2592000);

    if(request.method === "POST"){

        let req_ob;
        let res_ob;
        let logs;

        request.on("data", (chunk) => {

            req_ob = JSON.parse(chunk.toString());

            if(req_ob.method === "connect"){
            
                let result1 = false;
                
                clearTimeout(time_connect);
                
                clearTimeout(time_p2);
                
                time_connect = setTimeout(()=>{
                
                    let result1 = false;
                    
                    while(!result1){
                
                        result1 = phantom_rooms1().then(()=>{
                            
                            if(result1){
                    
                                time_p2 = setTimeout(()=>{
                        
                                    let result2 = false;
                            
                                    while(!result2){
                            
                                        result2 = phantom_rooms2().then();
                                    }  
                                },5000);
                            }
                        });
                   }
                },10000);

                res_ob = {

                        "reject":false,
                        "ip":request.socket.remoteAddress,
                        "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

                    if(!err1){

                        logs = JSON.parse(data);

                        if(logs.length === 0){

                            logs = [[],[],0,[]];

                            try {

                                fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                                res_ob.result = true;
                            } catch(err) {}

                        }else if(logs[1]){
                        
                            let cont_reject = 0;
                        
                            logs[1].forEach((pl)=>{
                            
                                if(res_ob.ip === pl.ip){
                                
                                    cont_reject++;    
                                }
                            })

                            if(cont_reject > 4 || logs[1].length > 9){

                                res_ob.reject = true;  
                                
                            }
    
                            logs[1] = [];

                            try {

                                fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));
                                
                            }catch(err) {}
                        }else{
    
                            logs[1] = [];

                            try {

                                fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                                res_ob.result = true;
                            }catch(err) {}
                        }

                        response.writeHead(200, {"Content-Type": "text/plain"});

                        response.end(JSON.stringify(res_ob), "utf-8");
                    }
                });

            }else if(req_ob.method === "active"){

                res_ob = {

                    "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

                    if(!err1){

                        try{

                        logs = JSON.parse(data);

                        let flag = false;

                        logs[1].forEach((user)=>{

                            if(user.user_id === req_ob.user_id){

                                flag = true;
                            }
                        })

                        if(!flag){

                            logs[1].push(req_ob);
                        
                            try {

                                fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                                res_ob.result = true;
                            }catch(err2){}
                        }

                        

                        }catch(err1){}

                        
                    }
                });

                response.writeHead(200, {"Content-Type": "text/plain"});

                response.end(JSON.stringify(res_ob), "utf-8");
   
            }else if(req_ob.method === "chat"){

                res_ob = {

                    "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

                    if(!err1){

                        logs = JSON.parse(data);

                        if(logs[0].length > 4){

                            let new_chats = [];

                            for(let p = logs[0].length - 2; p < logs[0].length; p++){

                                new_chats.push(logs[0][p]);
                            }

                            logs[0] = new_chats;
                        }

                            let chat_ob = {

                                "all":req_ob.all,
                                "msg":req_ob.msg,
                                "user_name":req_ob.user_name,
                                "chat_id":req_ob.chat_id,
                                "room_id":req_ob.room_id,
                                "index":logs[2]
                            }

                            logs[0].push(chat_ob);

                            logs[2]++;

                            try {

                                fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                                res_ob.result = true;
                            }catch(err) {}
                    }
                });

                response.writeHead(200, {"Content-Type": "text/plain"});

                response.end(JSON.stringify(res_ob), "utf-8");
            }else if(req_ob.method === "create_room"){

                let master = {

                    "user_id":req_ob.user_id,
                    "user_name":req_ob.user_name,
                    "team":req_ob.team,
                    "score":0
                }

                res_ob = {

                    "result":false,
                    "playing":false,
                    "first":true,
                    "room_id":req_ob.room_id,
                    "master":master,
                    "change":guid(),
                    "players":[],
                    "size":false,
                    "matrix":false,
                    "current_turn":0,
                    "last_turn":0,
                    "iax":false,
                    "iay":false,
                    "ibx":false,
                    "iby":false,
                    "winner":false,
                    "winner_score":false,
                    "finished_ob":false,
                    "finished":false,
                    "square_completed":false,
                    "skipped":false,
                    "new_players":[],
                    "square_by":false,
                    "sq_indx":false
                }

                res_ob.players.push(master);

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

                    if(!err1){ 

                        logs = JSON.parse(data);

                        logs[3].push(res_ob);
                    } 

                    try {

                        fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                        res_ob.result = true;
                    } catch(err) {}

                });

                response.writeHead(200, {"Content-Type": "text/plain"});

                response.end(JSON.stringify(res_ob), "utf-8"); 
            }else if(req_ob.method === "join_room"){

                res_ob = {

                    "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

                    if(!err1){ 

                        logs = JSON.parse(data);

                        let player = {

                                "user_id":req_ob.user_id,
                                "user_name":req_ob.user_name,
                                "team":req_ob.team,
                                "score":0
                        }

                        logs[3].forEach((room)=>{

                            if(room.room_id === req_ob.room_id){

                                room.change = guid();
                                room.players.push(player);        
                            }
                        })
                    } 

                    try {

                        fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                        res_ob.result = true;
                    } catch(err) {}

                });

                response.writeHead(200, {"Content-Type": "text/plain"});

                response.end(JSON.stringify(res_ob), "utf-8");    
            }else if(req_ob.method === "exit_room"){

                res_ob = {

                    "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {
                    
                    if(!err1){ 

                        let rooflag = -1;
                        let masterflag = -1;
                        let plflag = false;

                        logs = JSON.parse(data);
                        
                        logs[3].forEach((rm, inx)=>{
                        
                            if(req_ob.room_id === rm.room_id){
                            
                                rooflag = inx;
                            
                                rm.players.forEach((pl, ind)=>{
                                
                                    if(pl.user_id === req_ob.user_id){
                                    
                                        plflag = ind;
                                        
                                        if(req_ob.user_id === rm.master.user_id){
                                        
                                            masterflag = true;
                                        }
                                    }    
                                })
                            }
                        })

                        if(rooflag !== -1 && plflag !== -1){

                            logs[3][rooflag].players.splice(plflag, 1);
                            logs[3][rooflag].change = guid();
                        }
                        
                        if(rooflag !== -1 && masterflag && logs[3][rooflag].players.length > 0){
                        
                            logs[3][rooflag].master = logs[3][rooflag].players[random_int(0, (logs[3][rooflag].players.length - 1))];
                        }
                        
                        try {

                            fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                            res_ob.result = true;
                        } catch(err) {}
                    } 
                });

                response.writeHead(200, {"Content-Type": "text/plain"});

                response.end(JSON.stringify(res_ob), "utf-8");    
            }else if(req_ob.method === "phantom_check"){

                res_ob = {

                    "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

                    if(!err1){

                        logs = JSON.parse(data);

                        logs[1] = [];

                        try {

                            fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                            res_ob.result = true;
                            
                            clearTimeout(phantom_time[req_ob.room_id]);

                            phantom_time[req_ob.room_id] = setTimeout(()=>{

                                phantom_check(req_ob.room_id, 1);
                            }, 5000);
                        }catch(err) {}
                    }

                    response.writeHead(200, {"Content-Type": "text/plain"});

                    response.end(JSON.stringify(res_ob), "utf-8");
                });
            }else if(req_ob.method === "change_name"){
            
                res_ob = {

                    "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

                    if(!err1){

                        logs = JSON.parse(data);
                        
                        logs[1].forEach((user)=>{
                        
                            if(user.user_id === req_ob.user_id){
                            
                                user.user_name = req_ob.new_name;
                                user.team = req_ob.team;
                            }
                        })
                        
                        if(logs[0].length > 4){

                            let new_chats = [];

                            for(let p = logs[0].length - 2; p < logs[0].length; p++){

                                new_chats.push(logs[0][p]);
                            }

                            logs[0] = new_chats;
                        }
                        
                        let msgn = req_ob.user_name + " has changed to " + req_ob.new_name;

                            let chat_ob = {

                                "all":true,
                                "msg":msgn,
                                "user_name":"notice",
                                "chat_id":guid(),
                                "room_id":false,
                                "index":logs[2]
                            }

                            logs[0].push(chat_ob);

                            logs[2]++;
                        
                        try {

                            fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                            res_ob.result = true;
                        }catch(err) {}
                    }
                    
                    response.writeHead(200, {"Content-Type": "text/plain"});

                    response.end(JSON.stringify(res_ob), "utf-8");
                });    
            }else if(req_ob.method === "change_team"){
            
                res_ob = {

                    "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {

                    if(!err1){ 
                    
                        logs = JSON.parse(data);
                        
                        logs[1].forEach((user)=>{
                        
                            if(user.user_id === req_ob.user_id){
                            
                                user.team = req_ob.team;
                            }
                        })
                        
                        logs[3].forEach((room)=>{
                        
                            if(room.room_id === req_ob.room_id){
                            
                                 room.players.forEach((player)=>{
                                 
                                    if(player.user_id === req_ob.user_id){
                                    
                                        player.team = req_ob.team;
                                        
                                        room.change = guid();
                                    }
                                 })
                            }
                        })
                        
                        try {

                            fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                            res_ob.result = true;
                        }catch(err) {}
                   }
                   
                   response.writeHead(200, {"Content-Type": "text/plain"});

                   response.end(JSON.stringify(res_ob), "utf-8");
                });     
            }else if(req_ob.method === "go_start"){
            
                phantom_check(req_ob.room_id, 1);
            
                res_ob = {

                    "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {
                
                    if(!err1){ 
                    
                        logs = JSON.parse(data);
                        
                        let room_id;
                        let current_turn;
                        let change;
                        
                        logs[3].forEach((room)=>{
                        
                            if(room.room_id === req_ob.room_id){
                        
                                 room.players.forEach((pl)=>{
                        
                                    pl.score = 0;
                                    
                                    logs[1].forEach((us)=>{
                                    
                                        if(us.user_id === pl.user_id){
                                        
                                            us.score = 0;
                                        }
                                    })
                                 })   
                            
                                 room.playing = true;
                                 room.size = req_ob.size;
                                 room.change = guid();
                                 
                                 room_id = room.room_id;
                                 current_turn = room.current_turn;
                                 change = room.change;
                            }
                        })
                        
                        try {

                            fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                            res_ob.result = true;
                            
                            if(skip_time[room_id]){
                            
                                clearTimeout(skip_time[room_id]);
                            }
                            
                            skip_time[room_id] = setTimeout(()=>{
                                        
                                skip_player(room_id, current_turn, change);
                            },8000);
                        }catch(err) {}
                        
                    } 
                
                    response.writeHead(200, {"Content-Type": "text/plain"});

                    response.end(JSON.stringify(res_ob), "utf-8");
                });    
            }else if(req_ob.method === "line"){
                            
                clearTimeout(skip_time[req_ob.room_id]);
            
                res_ob = {

                    "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => { 
                
                    if(!err1){ 
                    
                        logs = JSON.parse(data);
                        
                        let winner_flag = false;
                        
                        logs[3].forEach((room)=>{
                        
                            if(room.room_id === req_ob.room_id){
                            
                                room.method = "line";
                                room.iax = req_ob.iax;
                                room.iay = req_ob.iay;
                                room.ibx = req_ob.ibx;
                                room.iby = req_ob.iby;
                                room.winner = req_ob.winner;
                                room.winner_score = req_ob.winner_score;
                                room.change = guid();
                                room.last_turn = room.current_turn;
                                room.finished_ob = req_ob.finished_ob;
                                room.square_completed = req_ob.square_completed;
                                room.square_by = req_ob.square_by;
                                room.skipped = false;
                                room.sq_indx = req_ob.sq_indx;
                                
                                if(room.first){
                                
                                    room.first = false;
                                }
                                
                                
                                if(!req_ob.square_completed){
                                
                                    if(room.current_turn < (room.players.length-1)){
                                
                                        room.current_turn++;
                                    }else{
                                
                                        room.current_turn = 0;
                                    }
                                }else{
                                
                                    if(req_ob.double){
                                
                                        room.players[room.current_turn].score += 2;
                                    }else{
                                    
                                        room.players[room.current_turn].score++;
                                    }
                                }
                                
                                //CHECK IF NEXT PLAYER IS ABSENT
                                        
                                skip_time[room.room_id] = setTimeout(()=>{
                                        
                                    skip_player(room.room_id, room.current_turn, room.change);
                                },8000);
                                
                                winner_flag = room.winner;
                            }
                        })
                        
                        if(winner_flag){
                        
                            logs[1] = [];
                            
                            clearTimeout(phantom_time[req_ob.room_id]);
                                
                            phantom_time[req_ob.room_id] = setTimeout(()=>{
                                
                                phantom_check(req_ob.room_id, 2);
                            },5000);
                        }
                        
                        try {

                            fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                            res_ob.result = true;
                        }catch(err) {}
                        
                    } 
                
                    response.writeHead(200, {"Content-Type": "text/plain"});

                    response.end(JSON.stringify(res_ob), "utf-8");
                    });   
            }else if(req_ob.method === "finish"){

                res_ob = {

                    "result":false
                }

                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {
                    
                    if(!err1){ 
                    
                        logs = JSON.parse(data);
                        
                        logs[1] = [];

                        const new_room = {

                            "finished":true,
                            "result":false,
                            "playing":false,
                            "first":true,
                            "room_id":req_ob.room_id,
                            "master":req_ob.master,
                            "change":guid(),
                            "players":req_ob.players,
                            "size":false,
                            "matrix":false,
                            "current_turn":0,
                            "last_turn":0,
                            "iax":false,
                            "iay":false,
                            "ibx":false,
                            "iby":false,
                            "winner":false,
                            "winner_score":false,
                            "finished_ob":false,
                            "square_completed":false,
                            "skipped":false,
                            "new_players":[],
                            "square_by":false,
                            "sq_indx":false
                        }
                        
                        let new_rooms = [];
                        
                        logs[3].forEach((room)=>{

                            if(room.room_id === new_room.room_id){

                                new_rooms.push(new_room);        
                            }else{
                            
                                new_rooms.push(room);
                            }
                        })
                        
                        logs[3] = new_rooms;
                        
                        clearTimeout(phantom_time[req_ob.room_id]);

                    try {

                        fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                        res_ob.result = true;
                    } catch(err) {}
                    
                    }

                }); 
                
                response.writeHead(200, {"Content-Type": "text/plain"});

                response.end(JSON.stringify(res_ob), "utf-8");   
            }else if(req_ob.method === "enable_room"){
            
                res_ob = {

                    "result":false
                }
                
                fs.readFile("kq2qmrej7f2j8ox.txt", "utf-8", (err1, data) => {
                    
                    if(!err1){ 
                    
                        logs = JSON.parse(data);
                        
                        logs[3].forEach((room)=>{

                            if(room.room_id === req_ob.room_id){

                                room.finished = false;
                                room.change = guid();
                                
                                room.players.forEach((pl)=>{
                                
                                    pl.score = 0;
                                    
                                    logs[1].forEach((us)=>{
                                    
                                        if(us.user_id === pl.user_id){
                                        
                                            us.score = 0;
                                        }
                                    })
                                })     
                            }
                        }) 
                        
                        try {

                            fs.writeFileSync("kq2qmrej7f2j8ox.txt", JSON.stringify(logs));

                            res_ob.result = true;
                        }catch(err) {} 
                   }
                });
                
                response.writeHead(200, {"Content-Type": "text/plain"});

                response.end(JSON.stringify(res_ob), "utf-8");
            }
        });

        return;
    }else if(request.headers.accept && request.headers.accept === "text/event-stream"){

        if(request.url === "/talk") {

            sendServerSendEvent(request, response);
        }else{

            request.writeHead(404);
            request.end();
        }

        return;
    }

    let filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    let extname = String(path.extname(filePath)).toLowerCase();
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });

            response.end(content, 'utf-8');  
        }
    });

}).listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}`);
});
