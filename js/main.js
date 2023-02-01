let canvas;

let canvas2;

let user_id;

let user_name;

let xhr;

let ip;

let dom_users_list;

let users;

let chat_text;

let chat_check;

let team_imgs;

let flood_flag;

let visible_chats;

let ani_canvas;

let ani_ctx;

let intro_dots;

let intro_used_lines;

let sign_img;

let room_container;

let rooms;

let myroom;

let imbusyflag;

let room_inside;

let immasterflag;

let start_btn;

let exit_btn;

let ingameflag;

let msgn;

let team_img;

let initial_team;

let closeBtn;

let closeBtn1;

let modal;

let small_canvas;
    
let medium_canvas;

let go_ob;

let canvas_container;

let small_dots;

let medium_dots;

let main_ctx;

let player_scores;

let players_container;

let players_divs;

let players_dom_scores;

let teams_dom_totals;

let teams_dom_totals_p;

let main_ctx2;

let ismyturnflag;

let modal_first;

let modal_second;

let modal_third;

let modal_third_title;

let p2;

let team_img2;

let msel2;

let modal_title;

let modal_count;

let end_game_flag;

let time_turn_other;

let time_turn_main;

let time_turn_pvp;

let turntime_main;

let turntime_pvp;

let render_once_flag;

let go_start_flag;

let play_squares;

let streak_flag;

let streak_time;

let aux_time;

let input2;

window.addEventListener("load", charge);



function charge(){

    document.addEventListener("click", printMousePos);

    team_imgs = document.querySelectorAll(".team_img");

    canvas = document.getElementById("canvas");
    
    canvas2 = document.getElementById("canvas2");
    
    canvas_container = document.getElementById("canvas_container")

    ani_canvas = document.getElementById("ani_canvas");
    
    ani_ctx = ani_canvas.getContext("2d");

    console_user = document.getElementById("console_user");
    
    console_user.addEventListener('mouseenter', readConsole);
    
    dom_users_list = document.getElementById("dom_users_list");
    
    chat_text = document.getElementById("chat_text");
    
    chat_check = document.getElementById("chat_check");

    room_container = document.getElementById("room_container");

    room_inside = document.getElementById("room_inside");

    start_btn = document.getElementById("start_btn");

    exit_btn = document.getElementById("exit_btn");
    
    closeBtn = document.getElementsByClassName("closeBtn")[0];
    
    closeBtn1 = document.getElementsByClassName("closeBtn")[1];
    
    modal = document.getElementById("simpleModal");
    
    small_canvas = document.getElementById("small_canvas");
    
    medium_canvas = document.getElementById("medium_canvas");
    
    players_container = document.getElementById("players_container");
    
    modal_first = document.querySelectorAll(".modal_first");
    
    modal_second = document.getElementById("modal_second");
    
    modal_third = document.querySelectorAll(".modal_third");
    
    modal_third_title = document.getElementById("modal_third_title");
    
    msel2 = document.getElementById("msel2"); 
    
    msel2.setAttribute("onclick", "team_select(this)");
    
    p2 = document.getElementById("p2");  
    
    team_img2 = document.getElementById("team_img2"); 
    
    modal_title = document.getElementById("modal_title");
    
    modal_count = document.getElementById("modal_count");
    
    input2 = document.getElementById("input2");
    
    modal_second.style.display = "none";
    
    modal_third[0].style.display = "none";
    
    modal_third_title.style.display = "none";
    
    modal_count.style.display = "none";
    
    small_dots = [];
    
    medium_dots = [];

    closeBtn.addEventListener("click", closeModal);

    closeBtn1.addEventListener("click", closeModal);
    
    initial_team = random_int(0, 109);

    sign_img = [];

    sign_img[0] = document.getElementById("sign1_img");
    sign_img[1] = document.getElementById("sign2_img");
    sign_img[2] = document.getElementById("sign3_img");
    sign_img[3] = document.getElementById("sign4_img");

    flood_flag = false;

    imbusyflag = false;

    immasterflag = false;

    myroom = false;

    ingameflag = false;
    
    player_scores = false;
    
    end_game_flag = false;
    
    render_once_flag = true;
    
    go_start_flag = false;
    
    streak_flag = false;
    
    rooms = [];
    
    user_id = guid();

    user_name = "user_" + user_id;

    flagfirst = 0;

    visible_chats = [];

    intro_dots = [];

    intro_used_lines = [];
    
    canvas_container.className = "no_canvas_container";

    intro();

    let p = document.createElement("p");

    const data24 = {

            "method":"connect",
            "user_id":user_id,
            "user_name":user_name
    } 

    let connect_result = false;

    while(!connect_result){

        connect_result = connect_data(data24).then(()=>{

            if(connect_result){

                p.setAttribute("style", "font-weight:bold;font-size:1.2rem;");
                
                p.innerText = "Welcome " + user_name;
                
                console_user.appendChild(p);
                              
                console_user.scrollTop = console_user.scrollHeight;
            }
        }); 
    }

    ws = new EventSource(window.location.origin + "/talk");

    ws.onmessage = (event)=>{

        res_ob = JSON.parse(event.data);

        if(res_ob.method === "update"){

            if(res_ob.data[3] && res_ob.data[3].length > 0){

                rooms = res_ob.data[3];

                rooms.forEach((room, index)=>{

                    if(imbusyflag){

                        if(room.master.user_id === user_id && !immasterflag){

                            immasterflag = true;
                        }

                        if(!immasterflag){

                            start_btn.className = "hide_grid-item";
                        }else{
                            
                            start_btn.className = "grid-itema";
                        }

                        room.players.forEach((player)=>{

                            if(player.user_id === user_id){
                            
                                if(room.playing && room.change !== myroom.change){
                                
                                    myroom = room;
                                    player_scores = myroom.players;
                                    
                                    clearTimeout(aux_time);
                                        
                                    clearTimeout(time_turn_other);
                                    
                                    if(players_divs){
                                    
                                        players_divs.forEach((d, index)=>{
    
                                            if(myroom.current_turn === index || index !== (players_divs.length - 1)){
        
                                                d.className = "players_div";
                                            }else if(index === (players_divs.length - 1)){
        
                                                d.className = "players_div_bottom";
                                            }
                                        })
                                    }
                                    
                                    if(myroom.players[myroom.current_turn].user_id === user_id){
                                        
                                        clearTimeout(time_turn_main);
                                    
                                        if(!ismyturnflag){
        
                                            const turntime = setTimeout(()=>{
        
                                                ismyturnflag = true;
                                                
                                                players_divs.forEach((d, index)=>{
    
                                                    if(myroom.current_turn === index){
        
                                                        d.className = "players_active_div";
                                                    }else if(index !== (players_divs.length - 1)){
                                            
                                                        d.className = "players_div";
                                                    }else if(index === (players_divs.length - 1)){
        
                                                        d.className = "players_div_bottom";
                                                    }
                                                })
                                            
                                                time_turn_main = setTimeout(()=>{
                                                
                                                    forced_shot();
        
                                                    ismyturnflag = false;
                                                    
                                                    players_divs.forEach((d, index)=>{
    
                                                        if(myroom.current_turn === index || index !== (players_divs.length - 1)){
        
                                                            d.className = "players_div";
                                                        }else if(index === (players_divs.length - 1)){
        
                                                            d.className = "players_div_bottom";
                                                        }
                                                    })
                                                },4000);
                                            },1000);
                                        }
                                    }else{
                                    
                                        ismyturnflag = false;
                                        
                                        if(players_divs){
                                    
                                        players_divs.forEach((d, index)=>{
    
                                                    if(myroom.current_turn === index){
        
                                                        d.className = "players_active_div";
                                                    }else if(index !== (players_divs.length - 1)){
                                            
                                                        d.className = "players_div";
                                                    }else if(index === (players_divs.length - 1)){
        
                                                        d.className = "players_div_bottom";
                                                    }
                                                })
                                        }
                                    }
                                    
                                    if(myroom.first){
                                    
                                        render_game();
                                    }else if(!myroom.first){
                                    
                                        handle_room();
                                    }
                                
                                }else if(!room.playing && !room.finished){

                                let flag3 = false;

                                let flag4 = false;

                                if(!myroom){

                                    flag3 = true;
                                }else{

                                    if(myroom.change !== room.change){

                                        flag4 = true;
                                    }
                                }

                                myroom = room;

                                if(flag3 || (!ingameflag && flag4)){
                                
                                    myroom = room;

                                    introduce_player_cards();

                                    if(myroom.players.length > 1){

                                        room_inside.style.height = "400px";
                                    }
                               } 
                               
                               }else if(room.finished && room.change !== myroom.change){
                               
                                    myroom = room;
                                    
                                    // clear variables
                                    
                                    modal_first.forEach((it)=>{
    
                                        it.style.display = "block";
                                    }) 
                                    
                                    room_container.className = "hide_room_container";
                                    
                                    room_container.style.display = "none";
                                    
                                    canvas_container.className = "no_canvas_container";
                                    
                                    room_inside.style.display = "flex"; 
                                    
                                    players_container.innerHTML = "";
                                    
                                    players_divs.innerHTML = "";
                                    
                                    modal_second.innerHTML = "";
                                    
                                    modal_count.innerHTML = "";
                                    
                                    modal_title.innerText = "";
                                    
                                    play_squares = false;
                                    
                                    ingameflag = false;
    
                                    end_game_flag = false;
                                    
                                    render_once_flag = true;
    
                                    streak_flag = false;
                                    
                                    closeModal();
                                    
                                    introduce_player_cards();
                                    
                                    if(myroom.master.user_id === user_id){
                                    
                                        const enable_time = setTimeout(()=>{
                                            
                                            enable_room();
                                        },3000);
                                    }
                                    
                                    // clear variables
                               }
                            }
                        })
                    }else{

                        let roos = document.querySelectorAll(".grid-item");

                        let flag3 = false;

                        roos.forEach((roo)=>{

                            if(roo.dataset.id === room.room_id && roo.dataset.change !== room.change){

                                roo.innerHTML = "";

                                roo.setAttribute('data-change', room.change);
                                roo.setAttribute('data-count_players', room.players.length);

                                let h3 = document.createElement("h3");
                                h3.innerText = "Room " + index;

                                let img1 = document.createElement("img");

                                if(!room.playing){

                                if(room.players.length < 4){

                                    img1.setAttribute("src", "./img/join.png");
                                    img1.setAttribute("onclick", "join_room(this)");
                                }else{

                                    img1.setAttribute("src", "./img/full.png");
                                    img1.setAttribute("onclick" ,"pre_phantom_check(this");
                                }
                                }else{
                                
                                    img1.setAttribute("src", "./img/play.png");
                                    h3.innerText = "Playing";
                                    img1.setAttribute("onclick", "pre_phantom_check(this)");
                                }

                                img1.setAttribute("style", "width:65px;height:50px;cursor:pointer;margin-left:30px;");
                        
                                roo.appendChild(h3);
                                roo.appendChild(img1);

                                room.players.forEach((player)=>{

                                    let p3 = document.createElement("p");
                                    p3.innerText = player.user_name;

                                    roo.appendChild(p3);
                                })

                            flag3 = true;
                        }else if(roo.dataset.id === room.room_id){

                            flag3 = true;    
                        }
                    })

                    if(!flag3){

                        let roo = document.createElement("div");
                        roo.setAttribute("class", "grid-item");
                        roo.setAttribute('data-id', room.room_id);
                        roo.setAttribute('data-change', room.change);
                        roo.setAttribute('data-count_players', room.players.length);

                        let img1 = document.createElement("img");
                        let h3 = document.createElement("h3");
                        
                        if(!room.playing){

                                if(room.players.length < 4){

                                    img1.setAttribute("src", "./img/join.png");
                                    img1.setAttribute("onclick", "join_room(this)");
                                }else{

                                    img1.setAttribute("src", "./img/full.png");
                                    img1.setAttribute("onclick", "pre_phantom_check(this)");
                                }
                        h3.innerText = "Room " + index;
                        
                        }else{
                        
                            img1.setAttribute("src", "./img/play.png");
                            h3.innerText = "Playing";
                            img1.setAttribute("onclick", "pre_phantom_check(this)");
                        }

                        img1.setAttribute("style", "width:65px;height:50px;cursor:pointer;margin-left:30px;");
                        
                        roo.appendChild(h3);
                        roo.appendChild(img1);

                                room.players.forEach((player)=>{

                                    let p3 = document.createElement("p");
                                    p3.innerText = player.user_name;

                                    roo.appendChild(p3);
                                })

                        room_container.prepend(roo);
                    }

                    }    
                })
            }else{

                render_lobby();
            }

            

            users = res_ob.data[1];
            if(users){

                render_users_list();
            
                h2.innerText = "online users (" + users.length + ")";

            }else{
            
                users = [];
            }

            let new_chats = [];

            if(res_ob.data[0]){

                res_ob.data[0].forEach((chat)=>{

                    let insertflag = false;

                    visible_chats.forEach((chat2)=>{

                        if(chat.index === chat2.index){

                            insertflag = true;   
                        }
                    })

                    if(!insertflag){

                        if((imbusyflag && !chat.all && chat.room_id === myroom.room_id) || chat.all){

                            visible_chats.push(chat);
                            new_chats.push(chat);
                        }       
                    }    
                })

                append_chats(new_chats);

            }
            
            let active_flag = false;
            
            users.forEach((user)=>{
            
                if(user.user_id === user_id){
                
                    active_flag = true;
                }
            })
            
            if(!active_flag){
            
                let score_number = 0;
                
                if(player_scores){
                
                    player_scores.forEach((player)=>{
                
                        if(player.user_id === user_id){
                        
                            score_number = player.score;
                        }           
                    })   
                }

                let req_ob33 = {
            
                    "method":"active",
                    "user_id":user_id,
                    "user_name":user_name,
                    "ip":ip,
                    "team":initial_team,
                    "score":score_number
                }

                let active_result = false;

                while(!active_result){

                    active_result = send_active(req_ob33).then();
                }
            }
        }
    }
}

async function send_room(room_ob88){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(room_ob88));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

function enable_room(){

    let enable_ob = {
                                        
        "method":"enable_room",
        "room_id":myroom.room_id
    }
                                                
    let enable_result = false;
                                        
    while(!enable_result){
                                        
        enable_result = send_enable(enable_ob).then();   
    }
}

function introduce_player_cards(){

                                    let players_inside = document.querySelectorAll(".grid-itemb");

                                    players_inside.forEach((player_card)=>{

                                        room_inside.removeChild(player_card);
                                    })

                                    myroom.players.forEach((player2, index2)=>{

                                        let card = document.createElement("div");
                                        card.setAttribute("class", "grid-itemb");

                                        let h3 = document.createElement("h3");
                                        
                                        if(player2.user_id === myroom.master.user_id){

                                            h3.innerText = "Room Master";
                                        }else{
                            
                                            h3.innerText = "player " + (index2+1);
                                        }
                                        
                                        let imgt = document.createElement("img");
                                        imgt.setAttribute("src", teams[player2.team].img);
                                        imgt.setAttribute("style", "width:50px;height:50px;margin-left:30px;");
                                        imgt.setAttribute("id", "team_img");
                                            

                                        let p3 = document.createElement("p");
                                        p3.innerText = player2.user_name;
                                        
                                        let se2 = false;

                                        card.appendChild(h3);
                                        
                                        card.appendChild(imgt);
                                        
                                        if(player2.user_id === user_id){
                                            
                                            se2 = document.createElement("select");
                                            se2.setAttribute("onchange", "team_select(this)");
                                            
                                            let opt2 = [];
                                            
                                            opt2[0] = document.createElement("option");
                                            opt2[0].setAttribute("selected", true);
                                            opt2[0].value = player2.team;
                                            opt2[0].text = teams[player2.team].sign + " " + teams[player2.team].name + " team";
                                            se2.add(opt2[0]);
                                            
                                            for(let j = 1; j < 112; j++){
                                            
                                                if(j !== player2.team){
                                            
                                                    opt2[j] = document.createElement("option");
                                                    opt2[j].value = j;
                                                    opt2[j].text = teams[j].sign + " " + teams[j].name + " team";
                                                    se2.add(opt2[j]);
                                                }
                                            }
                                            
                                            card.appendChild(se2);
                                        }
                                            
                                        card.appendChild(p3);

                                        room_inside.prepend(card);
                                    })
}

function start_game(){

    if(myroom.master.user_id !== user_id || myroom.players.length < 2){
    
        return;
    }
    
    modal_third[0].style.display = "none";
    
    modal_third_title.style.display = "none";
    
    modal_first.forEach((it)=>{
    
        it.style.display = "block";
    }) 

    openModal();
    
    select_canvas_ani();
}

function team_select(se){
    
    if(myroom){

        team_img = document.getElementById("team_img");
    
        team_img.src = teams[se.value].img;
            
        initial_team = se.value;

        let req_ob33 = {
            
                "method":"change_team",
                "user_id":user_id,
                "room_id":myroom.room_id,
                "team":se.value
            }

        let team_result = false;

        while(!team_result){

            team_result = send_team(req_ob33).then();
        }
    
    }else{
    
        team_img2.src = teams[se.value].img;
            
        initial_team = se.value;
    }
    
}

async function send_enable(enable88){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(enable88));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

async function send_team(req_ob88){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(req_ob88));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

function exit_room(){

    let data88 = {

        "method":"exit_room",
        "user_id":user_id,
        "room_id":myroom.room_id
    }

    let exit_result = false;

    while(!exit_result){

        exit_result = exit_data(data88).then(()=>{

            if(exit_result){

                render_lobby();
            }
        }); 
    }    
}

function phantom_check(room_id){

    let data88 = {

        "method":"phantom_check",
        "room_id":room_id
    }    

    let check_result = false;

    while(!check_result){

        check_result = check_data(data88).then(); 
    }
}

async function check_data(req_ob88){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(req_ob88));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

function join_room(roo){

    if(roo.parentNode.dataset.count_players >= 4){

        return;
    }

    phantom_check(roo.parentNode.dataset.id);

    let data88 = {

        "method":"join_room",
        "user_id":user_id,
        "user_name":user_name,
        "room_id":roo.parentNode.dataset.id,
        "team":initial_team,
        "score":0
    }

    let join_result = false;

    while(!join_result){

        join_result = join_data(data88).then(()=>{

            if(join_result){

                imbusyflag = true;

                render_room(); 
            }
        }); 
    }
}

async function exit_data(req_ob88){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(req_ob88));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

async function join_data(req_ob88){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(req_ob88));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

function render_room(){

    room_container.className = "hide_room_container";
    room_container.style.display = "none";
    room_inside.className = "room_container";
    room_inside.style.display = "flex"; 
}

function render_lobby(){

    myroom = false;

    immasterflag = false;

    play_squares = false;
                                    
    ingameflag = false;
    
    end_game_flag = false;
                                    
    render_once_flag = true;
    
    imbusyflag = false;

    let roos = document.querySelectorAll(".grid-item");

    roos.forEach((roo)=>{

        room_container.removeChild(roo);    
    })

    room_container.className = "room_container";
    room_container.style.display = "flex";  
    room_inside.className = "hide_room_container";
    room_inside.style.display = "none";
}

function create_room(){

    if(imbusyflag){
    
        return;
    }

    let roos = document.querySelectorAll(".grid-item");
    
    if(roos.length > 1){
    
        return;
    }

    const data24 = {

            "method":"create_room",
            "room_id":guid(),
            "user_id":user_id,
            "user_name":user_name,
            "team":initial_team
    } 

    let create_result = false;

    while(!create_result){

        create_result = create_data(data24).then(()=>{

            if(create_result){

                imbusyflag = true;

                render_room(); 
            }
        }); 
    }    
}

async function create_data(req_ob88){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(req_ob88));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

function intro_strokes(){

    ani_ctx.clearRect(0, 0, ani_canvas.width, ani_canvas.height);

    ani_ctx.fillStyle = "white";

	ani_ctx.fillRect(ani_canvas.width/3.6, ani_canvas.height/2.8, 70, 60);

    ani_ctx.fillStyle = "black";

    let p = 0;

    for(let c = 0; c < 4; c++){

        for(let b = 0; b < 4; b++){

            ani_ctx.beginPath();

            ani_ctx.fillRect(((ani_canvas.width/3.6) + (b * 20) + 4), ((ani_canvas.height/2.8) + (c * 16) + 6), 2, 2);

            let ob = {

                "x":((ani_canvas.width/3.6) + (b * 20) + 4),
                "y":((ani_canvas.height/2.8) + (c * 16) + 6),
                "ix":b,
                "iy":c,
                "used":false
            }

            intro_dots.push(ob);

            p++;
        } 
    }

    let lines = [];

    let a = 0;

    while(a < 24){

        let dot1 = random_int(0, 15);

        let dot2 = random_int(0, 15);

        let flag = false;

        lines.forEach((line)=>{

            if(((line.iax === intro_dots[dot1].ix && line.iay === intro_dots[dot1].iy) && (line.ibx === intro_dots[dot2].ix && line.iby === intro_dots[dot2].iy))){

                flag = true;
            }
        })
   
        

        if((((intro_dots[dot1].ix + 1) === intro_dots[dot2].ix && intro_dots[dot1].iy === intro_dots[dot2].iy) ||  
           (intro_dots[dot1].ix === intro_dots[dot2].ix && (intro_dots[dot1].iy + 1) === intro_dots[dot2].iy)) && !flag){

            let ob = {

                "ax":intro_dots[dot1].x,
                "ay":intro_dots[dot1].y,
                "bx":intro_dots[dot2].x,
                "by":intro_dots[dot2].y,
                "iax":intro_dots[dot1].ix,
                "iay":intro_dots[dot1].iy,
                "ibx":intro_dots[dot2].ix,
                "iby":intro_dots[dot2].iy,
                "dot1":dot1,
                "dot2":dot2,
                "used":false,
                "square1":false,
                "square2":false
            } 

            lines.push(ob); 

            a++;  
        }
    }

    a = 0;

    


    let inter1 = setInterval(()=>{

        if(a >= 24){

            clearInterval(inter1);
            return;
        }
        
        ani_ctx.beginPath();

        ani_ctx.moveTo(lines[a].ax, lines[a].ay);

        ani_ctx.lineTo(lines[a].bx, lines[a].by);

        ani_ctx.stroke();

        intro_used_lines.push(lines[a]);

        

        intro_squares.forEach((sq)=>{

            let sq_count = 0;

            sq.lines.forEach((line)=>{

                intro_used_lines.forEach((used_line)=>{

                    if(used_line.iax === line.iax && used_line.iay === line.iay && used_line.ibx === line.ibx && used_line.iby === line.iby && !sq.painted){

                        line.ax = used_line.ax;
                        line.ay = used_line.ay;
                        line.bx = used_line.bx;
                        line.by = used_line.by;

                        sq_count++;
                    }
                }) 
            })

            if(sq_count >= 4){

                ani_ctx.drawImage(sign_img[random_int(0, 3)], sq.lines[0].ax + 5, sq.lines[0].ay + 5, 10, 10); 

                sq.painted = true;
            }

        })
        a++;
    }, 1000);
}

function intro(){

    let ani_canvas2 = document.getElementById("ani_canvas2");

    let kids_img = document.getElementById("kids_img");

    let ani_ctx2 = ani_canvas2.getContext("2d");

    ani_ctx2.drawImage(kids_img, 0, 0, ani_canvas.width, ani_canvas.height);

    intro_strokes();
}



function notify_alert(text, duration){

    let timed;

    if(!duration){
    
        timed = 5000;
    }else{
    
        timed = duration;
    }

    notifyType.innerText = text;

    notifyType.className = "active";

    let timeout = setTimeout(()=>{

        notifyType.className = "notify";

  }, timed);
}

function append_chats(new_chats){

    new_chats.forEach((chat)=>{

            let p = document.createElement("p");

            if(chat.all){
       
                p.setAttribute("style", "font-style:italic;color:white;");

                let up = document.createElement("p");
                up.setAttribute("style", "font-style:italic;color:white;font-weight:bold;");
                up.innerText = "\n" + chat.user_name + ":";

                p.innerText = chat.msg;

                console_user.appendChild(up);
                console_user.appendChild(p);
                
            }else if(!chat.all){

                p.setAttribute("style", "font-style:italic;color:Gold;");

                let up = document.createElement("p");
                up.setAttribute("style", "font-style:italic;color:Gold;font-weight:bold;");
                up.innerText = "\n" + chat.user_name + ":";

                p.innerText = chat.msg;

                console_user.appendChild(up);
                console_user.appendChild(p);  
            }

            
                              
            console_user.scrollTop = console_user.scrollHeight;
    })
}

function chunkSubstr(str, size) {

  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {

        chunks[i] = str.substr(o, size);
  }

  return chunks;
}

function chat(){

    if(chat_text.value === "" || !chat_text.value){
    
        return;
    }else if(chat_text.value.length > 255){

        msgn = "maximum 255 characters";
        notify_alert(msgn, false);
        return;
    }else if(flood_flag){

        msgn = "maximum 1 message per second";
        notify_alert(msgn, false);
        return;   
    }

    let chunks;

    if(window.matchMedia("(max-width:540px)").matches){
  
        chunks = chunkSubstr(chat_text.value, 27);

    }else if(window.matchMedia("(min-width:768px)").matches){
        
        chunks = chunkSubstr(chat_text.value, 81);
    }else{
        
        chunks = chunkSubstr(chat_text.value, 50);
    }

    
    let big_str = "";

    chunks.forEach((chunk)=>{

        big_str += chunk + " ";
    })

    let room_id = false;

    if(imbusyflag){

        room_id = myroom.room_id;
    }

    let req_ob11 = {
    
            "method":"chat",
            "all":chat_check.checked,
            "msg":big_str,
            "room_id":room_id,
            "user_name":user_name,
            "chat_id":guid()
        }

        let chat_result = false;

        while(!chat_result){

        chat_result = send_chat(req_ob11).then(()=>{

                                    if(chat_result){

                                        chat_text.value = "";
                                    }
                                });
        }
}



async function send_chat(req_ob88){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(req_ob88));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

async function send_active(req_ob77){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(req_ob77));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob77 = JSON.parse(xhr.response);

                return res_ob77.result;
        }
    }
}


async function connect_data(data24){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data24));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob24 = JSON.parse(xhr.response);
                
                if(!res_ob24.reject){

                    ip = res_ob24.ip;

                    return res_ob24.result;
                }else{

                    window.location.replace("http://www.github.com/ipro8g/dot");
                }

                return true;
        }
    }
}

function render_users_list(){

    dom_users_list.innerHTML = "";
    
    let count = 0;

    for(var key in users){
            
        let p = document.createElement("div");
                
        p.innerHTML = `<p>${users[key].user_name}\t${teams[users[key].team].sign}</p>`;
        
        dom_users_list.appendChild(p);
        
        if(users[key].user_id === user_id){
                
            h1.innerHTML = "<span style='color:white;'>name:</span> " + users[key].user_name + "\t" + teams[users[key].team].sign;
            
            user_name = users[key].user_name;
        }
        
        count++;
    }
}


function readConsole(){

    console_user.style.height = '200px';

    console_user.addEventListener('mouseleave', playConsole);

    console_user.style.opacity = .8;
                              
    console_user.scrollTop = console_user.scrollHeight;
}


function playConsole(){

    console_user.style.height = '40px';

    console_user.addEventListener('mouseenter', readConsole);

    console_user.style.opacity = 1;
                              
    console_user.scrollTop = console_user.scrollHeight;
}


function random_int(min, max) {

    let floor = Math.ceil(min);
    let coil = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function guid(){

    return Math.round(Math.random() * 10000) + Math.round(Math.random() * 10000) + letters[random_int(0, 25)]; 
} 

function change_name(){

    if(imbusyflag){

        msgn = "name cannot be changed during pvp";
        
        notify_alert(msgn, false);

        return;
    }
    
    modal_first.forEach((it)=>{
    
        it.style.display = "none";
    }) 
    
    modal_third[0].style.display = "flex";
    modal_third_title.style.display = "block";
    
    team_img2.src = teams[initial_team].img;
    
    p2.innerText = user_name;
    
    let opt2a = [];
                                            
    opt2a[0] = document.createElement("option");
    opt2a[0].setAttribute("selected", true);
    opt2a[0].value = initial_team;
    opt2a[0].text = teams[initial_team].sign + " " + teams[initial_team].name + " team";
    msel2.add(opt2a[0]);
                                            
    for(let j = 1; j < 112; j++){
                                            
        if(j !== initial_team){
                                            
            opt2a[j] = document.createElement("option");
            opt2a[j].value = j;
            opt2a[j].text = teams[j].sign + " " + teams[j].name + " team";
            msel2.add(opt2a[j]);
        }
    }

    openModal();
}

function new_name_btn(){

    let new_name = input2.value;
    
    if(!new_name){
    
        return;
    }

    let name_flag = false;

    users.forEach((user)=>{

        if(new_name === user.user_name){

            msgn = "cannot use that name";
        
            notify_alert(msgn, false);

            name_flag = true;    
        }else if(new_name.length > 12){
        
            msgn = "name too long, MAX 12 characters";
        
            notify_alert(msgn, false);

            name_flag = true;
        }
    })
    
    if(!new_name || name_flag){
    
        return;
    }
    
    closeModal();
    
    let req_ob71 = {
            
                "method":"change_name",
                "user_id":user_id,
                "user_name":user_name,
                "new_name":new_name,
                "team":initial_team
    }
            
    let name_result = false;

        while(!name_result){

            name_result = send_change_name(req_ob71).then();
        }
}

async function send_change_name(req_ob17){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(req_ob17));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
            let res_ob117 = JSON.parse(xhr.response);

            return res_ob117.result;
        }
    }
}

function openModal(){
    
    modal.style.display = "block";
    
    go_ob = {
            
                "method":"go_start",
                "room_id":myroom.room_id,
                "size":"small"
    }
}

function closeModal(){

    modal.style.display = "none";
    
    modal_third[0].style.display = "none";
    
    modal_third_title.style.display = "none";
}

function select_canvas_ani(){

    let small_ctx = small_canvas.getContext("2d");
    
    small_ctx.clearRect(0, 0, small_canvas.width, small_canvas.height);

    small_ctx.fillStyle = "white";

	small_ctx.fillRect(0, 0, small_canvas.width, small_canvas.height);
    
    let medium_ctx = medium_canvas.getContext("2d");
    
    medium_ctx.clearRect(0, 0, medium_canvas.width, medium_canvas.height);

    medium_ctx.fillStyle = "white";

	medium_ctx.fillRect(0, 0, medium_canvas.width, medium_canvas.height);

    small_ctx.fillStyle = "black";
	
	for(let c = 0; c < 4; c++){

        for(let b = 0; b < 4; b++){

            small_ctx.beginPath();

            small_ctx.fillRect(((b * 24) + 8), ((c * 24) + 8), 2, 2);
        } 
    }
    
    

    medium_ctx.fillStyle = "black";
	
	for(let c = 0; c < 8; c++){

        for(let b = 0; b < 8; b++){

            medium_ctx.beginPath();

            medium_ctx.fillRect(((b * 12) + 2), ((c * 12) + 2), 2, 2);
        } 
    }
}

function select_size(can){

    if(can.dataset.size === "small"){
    
        small_canvas.className = "selected_canvas";
        medium_canvas.className = "non_selected";
        
        go_ob.size = "small";
    }else if(can.dataset.size === "medium"){
    
        medium_canvas.className = "selected_canvas";
        small_canvas.className = "non_selected";
        
        go_ob.size = "medium";
    }
}

function go_start(){

    if(go_start_flag){
    
        return;
    }
    
    go_start_flag = true;

    notify_alert("the game will start in 10 seconds", 10000);

    phantom_check(go_ob.room_id);
    
    const time1 = setTimeout(()=>{
    
        let go_result = false;

        while(!go_result){

            go_result = send_go().then();
        }
    
        small_canvas.className = "selected_canvas";
        medium_canvas.className = "non_selected";
    
        closeModal(); 
        
        go_start_flag = false;   
    },10000);
}

function pre_phantom_check(im){

    phantom_check(im.parentNode.dataset.id);
}

async function send_go(){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(go_ob));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

// CLICK FLASH EFFECT

function printMousePos(event){

  let pure = document.getElementById('pure');
  pure.style.position = "absolute";
  pure.style.left = event.clientX - 40 + 'px';
  pure.style.top = event.clientY - 40 + 'px';
  pure.className = "pure_end";

  let timeout = setTimeout(()=>{

        pure.className = "pure_start";
  }, 500)
}


// CLICK FLASH EFFECT
