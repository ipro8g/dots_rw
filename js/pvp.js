function handle_room(){

    if(myroom.finished_ob){
    
        end_game(false, false, myroom.finished_ob);
        
        return;
    }

    if(myroom.winner){
    
        end_game(myroom.current_turn, myroom.winner_score, false);
        
        return;
    }
    
    teams_dom_totals.forEach((team, index4)=>{
                            
        let sum = 0;
                            
        player_scores.forEach((player)=>{
                        
            if(parseInt(player.team) === team){
                        
                sum += player.score; 
            }
        })
                    
        teams_dom_totals_p[index4].innerText = sum;
    })
    
    if(myroom.players[myroom.last_turn].user_id !== user_id && !myroom.skipped){

    play_squares.forEach((square, sq_indx)=>{
        
            let cont1 = 0;
            
            square.lines.forEach((line)=>{
            
                if(line.painted){
                
                    cont1++;
                }
            
                if((myroom.iax === line.iax && myroom.iay === line.iay) && (myroom.ibx === line.ibx && myroom.iby === line.iby)){
                    
                    
                    if(line.vertical){
                    
                            animate_vline(line); 
                    }else{
                    
                            animate_hline(line);    
                            
                    }
                    
                    line.painted = true;
                
                    cont1++;
                }     
            })
            
            if(cont1 >= 4 && !square.painted){
            
                square.painted = true;
                        
                clearTimeout(time_turn_other);
                
                const turntime = setTimeout(()=>{
                                                
                    players_divs.forEach((d, index)=>{
    
                        if(myroom.current_turn === index){
        
                            d.className = "players_active_div";
                        }else if(index !== (players_divs.length - 1)){
                                            
                            d.className = "players_div";
                        }else if(index === (players_divs.length - 1)){
        
                            d.className = "players_div_bottom";
                        }
                    })
                                            
                    time_turn_other = setTimeout(()=>{
                                                    
                            players_divs.forEach((d, index)=>{
    
                                if(myroom.current_turn === index || index !== (players_divs.length - 1)){
        
                                    d.className = "players_div";
                                }else if(index === (players_divs.length - 1)){
        
                                    d.className = "players_div_bottom";
                                }
                            })
                        },4000);
                    },1000);
                
                animate_square(square);           
                
                player_scores.forEach((player, index2)=>{
                        
                        players_dom_scores.forEach((p_score, index3)=>{
                        
                            if(index2 === index3){
                            
                                p_score.innerText = player.score;
                            }    
                        })
                        
                        if(myroom.square_completed && player.team === player_scores[myroom.last_turn].team && myroom.square_by === player_scores[myroom.last_turn].user_id){
                        
                            if(myroom.sq_indx[0] === sq_indx){
                        
                            if(myroom.size === "small"){
                        
                                main_ctx.drawImage(team_imgs[player.team], (square.lines[0].ax + 20), (square.lines[0].ay + 20), 170, 170);
                            }else if(myroom.size === "medium"){
                        
                                main_ctx.drawImage(team_imgs[player.team], (square.lines[0].ax + 15), (square.lines[0].ay + 15), 80, 80);
                            }
                            
                            }else if(myroom.sq_indx[1]){
                            
                                if(myroom.sq_indx[1] === sq_indx){
                            
                                    if(myroom.size === "small"){
                        
                                        main_ctx.drawImage(team_imgs[player.team], (square.lines[0].ax + 20), (square.lines[0].ay + 20), 170, 170);
                                    }else if(myroom.size === "medium"){
                        
                                        main_ctx.drawImage(team_imgs[player.team], (square.lines[0].ax + 15), (square.lines[0].ay + 15), 80, 80);
                                    }
                                }    
                            } 
                        }
                })
            }else{
            
                players_divs.forEach((d, index)=>{
    
                    if(myroom.current_turn === index || index !== (players_divs.length - 1)){
        
                        d.className = "players_div";
                    }else if(index === (players_divs.length - 1)){
        
                        d.className = "players_div_bottom";
                    }
                })
                
        clearTimeout(aux_time);       
     
        aux_time = setTimeout(()=>{
    
        players_divs.forEach((d, index)=>{
    
                        if(myroom.current_turn === index){
        
                            d.className = "players_active_div";
                        }else if(index !== (players_divs.length - 1)){
                                            
                            d.className = "players_div";
                        }else if(index === (players_divs.length - 1)){
        
                            d.className = "players_div_bottom";
                        }
                    })
        },1000);
            }
     })
     
     }
}

function finish_game(){

    let new_players = [];
    
    myroom.players.forEach((pl)=>{
    
        pl.score = 0;
        new_players.push(pl);
    })

    let send_ob = {
    
        "method":"finish",
        "master":myroom.master,
        "room_id":myroom.room_id,
        "players":new_players
        
    }
    
    let finish_result = false;
    
    while(!finish_result){

        finish_result = send_finish(send_ob).then();
    }
}

async function send_finish(send_ob88){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(send_ob88));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

function check_game_continue(){
     
      let cont = 0;
     
      play_squares.forEach((square)=>{
      
        if(!square.painted){
        
            cont++;
        }
      })
      
      return cont;
}

function end_game(current_turn, winner_score, finished_ob){

    if(end_game_flag){
    
        return;
    }
    
    end_game_flag = true;

    modal_first.forEach((it)=>{
    
        it.style.display = "none";
    }) 
    
    modal_second.style.display = "flex";

    if(!finished_ob){

    let the_team = false;
    
    let max = {
    
        "score":-1,
        "team":false
    }
    
    player_scores.forEach((pl)=>{
    
        if(pl.score > max.score){

            max.score = parseInt(pl.score);
            max.team = parseInt(pl.team);    
        }    
    })
      
    modal_title.innerText = "Team " + teams[max.team].name + ", won the game";

    teams_dom_totals.forEach((team, index)=>{
    
        let card = document.createElement("div");
        card.setAttribute("class", "grid-itemb");
        
        let h3 = document.createElement("h3");  
        
        h3.innerText = teams[team].name + " Team";
        
        let imgt = document.createElement("img");
        imgt.setAttribute("src", teams[team].img);
        imgt.setAttribute("class", "team_img");

        let p3 = document.createElement("p");
        
        if(!current_turn && the_team !== parseInt(team.innerText)){
        
            p3.innerText = teams_dom_totals_p[index].innerText;
        }else if(!current_turn && the_team === parseInt(team.innerText)){
        
            p3.innerText = winner_score;
        }else if(!current_turn && team === player_scores[current_turn].team){
        
            p3.innerText = winner_score;
        }else{
        
            p3.innerText = teams_dom_totals_p[index].innerText;
        }
        
        card.appendChild(h3);
        card.appendChild(imgt);
        card.appendChild(p3);
        modal_second.appendChild(card);  
    })
    
    }else{
        
        let tie_teams = [];
    
        let the_team = {
        
            "score":-1,
            "team":false
        }
    
        teams_dom_totals.forEach((tm, indx)=>{
    
            let card = document.createElement("div");
            card.setAttribute("class", "grid-itemb");
        
            let h3 = document.createElement("h3");  
        
            h3.innerText = teams[tm].name + " Team";
        
            let imgt = document.createElement("img");
            imgt.setAttribute("src", teams[tm].img);
            imgt.setAttribute("class", "team_img");

            let p3 = document.createElement("p");
            p3.innerText = teams_dom_totals_p[indx].innerText;
        
            card.appendChild(h3);
            card.appendChild(imgt);
            card.appendChild(p3);
            modal_second.appendChild(card);  
        })
        
        let max_score = -1;
        
        finished_ob.forEach((tm)=>{
        
            if(tm.score > max_score){
            
                max_score = tm.score;
            }
        })
        
        finished_ob.forEach((tm)=>{
        
            if(tm.score === max_score){
            
                tie_teams.push(tm);
            }
        })
        
        if(tie_teams.length > 1){
        
            tie_teams.forEach((team)=>{
            
                modal_title.innerText += "Team " + teams[team.team].name + " "; 
            })
            
            modal_title.innerText += ", tied the game"; 
        }else{
        
            modal_title.innerText = "Team " + teams[tie_teams[0].team].name + ", won the game";
        } 
    }
    
    let time1_cont = 10;
    
    let h2 = document.createElement("h3");
    h2.setAttribute("style", "color:White;font-style:italic;");
    h2.innerText = time1_cont;
    
    modal_count.appendChild(h2)
    
    modal_count.style.display = "block";
    
    const time1 = setInterval(()=>{
         
        h2.innerText = "redirecting\n" + time1_cont + "\nseconds";
        time1_cont--;
        
        if(time1_cont <= 0){
        
            clearInterval(time1);
            
            if(myroom.master.user_id === user_id){
            
                finish_game();    
            }
        }
    },1000);
    
    openModal(); 
}

function forced_shot(){

    if(!ismyturnflag || end_game_flag){
    
        return;
    }

    let obj = {
    
        "iax":false,
        "iay":false,
        "ibx":false,
        "iby":false
    }

    for(let a = 0; a < play_squares.length; a++){
    
            let flag1 = false;
        
            for(let b = 0; b < play_squares[a].lines.length; b++){
            
                if(!play_squares[a].lines[b].painted){
                
                    obj.iax = play_squares[a].lines[b].iax;
                    obj.iay = play_squares[a].lines[b].iay;
                    obj.ibx = play_squares[a].lines[b].ibx;
                    obj.iby = play_squares[a].lines[b].iby;
                    
                    flag1 = true;
                    break;
                }
            }
            
            if(flag1){
            
                break;
            }
    }
    
    pvp_get_coords(false, true, JSON.stringify(obj));    
}

function pre_pvp_get_coords(e){

    pvp_get_coords(e, false, false)
}

function pvp_get_coords(event, opt, obj){

    if(!ismyturnflag){
    
        return;
    }
    
    let iax;
    let iay;
    let ibx;
    let iby;
    
    if(!opt){

    let x = event.offsetX * canvas2.width / canvas2.clientWidth;
    let y = event.offsetY * canvas2.height / canvas2.clientHeight;
    
    let line_result = false;
    
    if(myroom.size === "small"){
    
        play_squares.forEach((square)=>{
        
            square.lines.forEach((line)=>{
            
                if(line.vertical){
                
                    if((y > (line.ay + 48) && y < (line.by - 48)) && (x >= (line.ax - 42) && x <= (line.ax + 42)) && (!line.painted)){
                    
                        iax = line.iax;
                        iay = line.iay;
                        ibx = line.ibx;
                        iby = line.iby;
                        line_result = true;
                    }
                }else{
                
                
                    if((x > (line.ax + 48) && x < (line.bx - 48)) && (y >= (line.ay - 42) && y <= (line.ay + 42)) && (!line.painted)){
                    
                        iax = line.iax;
                        iay = line.iay;
                        ibx = line.ibx;
                        iby = line.iby;
                        line_result = true;
                    }       
                }    
            })
        })
    }else if(myroom.size === "medium"){
    
        play_squares.forEach((square)=>{
        
            square.lines.forEach((line)=>{
            
                if(line.vertical){
                
                    if((y > (line.ay + 24) && y < (line.by - 24)) && (x >= (line.ax - 21) && x <= (line.ax + 31)) && (!line.painted)){
                    
                        iax = line.iax;
                        iay = line.iay;
                        ibx = line.ibx;
                        iby = line.iby;
                        line_result = true;
                    }
                }else{
                
                
                    if((x > (line.ax + 24) && x < (line.bx - 24)) && (y >= (line.ay - 40) && y <= (line.ay + 50)) && (!line.painted)){
                    
                        iax = line.iax;
                        iay = line.iay;
                        ibx = line.ibx;
                        iby = line.iby;
                        line_result = true;
                    }       
                }    
            })
        })
    }
    
    if(!line_result){
    
            return;
    }else{
    
        ismyturnflag = false;
    }
    
    }else{
    
        const forced_obj = JSON.parse(obj);
    
        iax = forced_obj.iax;
        iay = forced_obj.iay;
        ibx = forced_obj.ibx;
        iby = forced_obj.iby;   
    }
    
    let send_ob = {
    
        "method":"line",
        "room_id":myroom.room_id,
        "players":myroom.players,
        "current_turn":myroom.current_turn,
        "square_completed":false,
        "winner":false,
        "winner_score":false,
        "iax":iax,
        "iay":iay,
        "ibx":ibx,
        "iby":iby,
        "finished_ob":false,
        "square_by":false,
        "double":false,
        "sq_indx":false
    }
    
    let send_ob_sq_indx = [];
    
    let count_double = 0;
    
    play_squares.forEach((square, psq_indx)=>{
        
            let cont1 = 0;
            
            square.lines.forEach((line)=>{
            
                if(line.painted){
                
                    cont1++;
                }
            
                if((iax === line.iax && iay === line.iay) && (ibx === line.ibx && iby === line.iby)){
                
                    if(line.vertical){
                    
                            animate_vline(line);
                    }else{
                    
                        animate_hline(line);
                    }
                    
                    line.painted = true;
                
                    cont1++;
                }     
            })
            
            if(cont1 >= 4 && !square.painted){
            
                square.painted = true;
                
                send_ob_sq_indx.push(psq_indx);
                                        
                clearTimeout(time_turn_pvp);
                        
                clearTimeout(time_turn_other);
                        
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
                            
                    time_turn_pvp = setTimeout(()=>{
                    
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
                },1500);
                
                player_scores.forEach((player, index2)=>{
            
                    if(user_id === player.user_id){
                    
                        main_ctx2.strokeStyle = "Gold";
                
                        player.score++;
                        
                        players_dom_scores.forEach((p_score, index3)=>{
                        
                            if(index2 === index3){
                            
                                p_score.innerText = player.score;
                            }
                        })
                        
                        if(myroom.size === "small"){
                        
                            main_ctx.drawImage(team_imgs[player.team], (square.lines[0].ax + 20), (square.lines[0].ay + 20), 170, 170);
                            count_double++;
                        }else if(myroom.size === "medium"){
                        
                            main_ctx.drawImage(team_imgs[player.team], (square.lines[0].ax + 15), (square.lines[0].ay + 15), 80, 80);
                            count_double++;
                        }
                        
                        
                        animate_square(square);
                        
                        send_ob.square_completed = true;
                        
                        send_ob.square_by = user_id;
                    }
                })
                
                if(count_double > 1){
                
                    send_ob.double = true;
                
                }
                
                teams_dom_totals.forEach((team, index4)=>{
                            
                    let sum = 0;
                            
                    player_scores.forEach((player)=>{
                        
                            if(parseInt(player.team) === team){
                        
                                sum += player.score; 
                            }
                    })
                    
                    teams_dom_totals_p[index4].innerText = sum;
                })
            }else{
            
                players_divs.forEach((d, index)=>{
    
                            if(myroom.current_turn === index || index !== (players_divs.length - 1)){
        
                                d.className = "players_div";
                            }else if(index === (players_divs.length - 1)){
        
                                d.className = "players_div_bottom";
                            }
                })
            }
     })
     
        if(send_ob_sq_indx.length > 0){
            
            send_ob.sq_indx = send_ob_sq_indx;
        }
     
        let send_result = false;
     
        const continue_flag = check_game_continue();
     
        if(continue_flag === 0){
        
            const result = search_winner("no_majority");
            
            send_ob.finished_ob = JSON.parse(result);
            
            send_result = false;

             while(!send_result){

                     send_result = send_shot(send_ob).then();
            }
            
            
            end_game(false, false, send_ob.finished_ob);
            
            return;
        }
     
     
     if(send_ob.square_completed){
     
        send_ob.winner = search_winner("majority");
     }else{
                
        clearTimeout(aux_time);  
     
        aux_time = setTimeout(()=>{
    
        players_divs.forEach((d, index)=>{
    
                        if(myroom.current_turn === index){
        
                            d.className = "players_active_div";
                        }else if(index !== (players_divs.length - 1)){
                                            
                            d.className = "players_div";
                        }else if(index === (players_divs.length - 1)){
        
                            d.className = "players_div_bottom";
                        }
                    })
        },2000);
     }
     
     if(send_ob.winner){
     
                let myteam;
                
                player_scores.forEach((ps)=>{
                    
                    if(ps.user_id === user_id){
                    
                        myteam = ps.team;
                    }
                }) 
                
                let cont = 0;

                player_scores.forEach((ps)=>{
                
                    if(ps.team === myteam){
                    
                        cont += ps.score;
                    }    
                })
                
                send_ob.winner_score = cont;  
     }
        
        players_divs.forEach((d, index)=>{
    
            if(myroom.current_turn === index || index !== (players_divs.length - 1)){
        
                d.className = "players_div";
            }else if(index === (players_divs.length - 1)){
        
                d.className = "players_div_bottom";
            }
        })
        
    ismyturnflag = false;
    
    send_result = false;

    while(!send_result){

        send_result = send_shot(send_ob).then();
    }
    
    if(!send_ob.square_completed){
        
        ismyturnflag = false;
    }
    
    if(send_ob.winner){
    
        end_game(false, send_ob.winner_score, false);
        
        return;
    }
}

function search_winner(op){

    if(op === "majority"){

                let myteam;
                
                player_scores.forEach((ps)=>{
                    
                    if(ps.user_id === user_id){
                    
                        myteam = ps.team;
                    }
                })

                let cont = 0;

                player_scores.forEach((ps)=>{
                
                    if(ps.team === myteam){
                    
                        cont += ps.score;
                    }    
                })
                
                if(cont >= 5 && myroom.size === "small"){
                
                    return true;
                }else if(cont >= 25 && myroom.size === "medium"){
                
                    return true;
                }
                
                return false;
    }else{

        let finished_ob = [];

        teams_dom_totals_p.forEach((p, index)=>{
    
            let ob = {
            
                "team":teams_dom_totals[index],
                "score":parseInt(p.innerText)
            }
        
            finished_ob.push(ob);
        })
    
        return JSON.stringify(finished_ob); 
    }    
}

async function send_shot(send_ob){

    xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(JSON.stringify(send_ob));

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState === 4) {
        
                const res_ob88 = JSON.parse(xhr.response);

                return res_ob88.result;
        }
    }    
}

function render_game(){

    if(!render_once_flag){
    
        return;
    }else{
    
        render_once_flag = false;
    }

    ingameflag = true;

    player_scores = myroom.players;
    
    if(myroom.size === "small"){
    
        const map = JSON.stringify(small_squares_map);
        play_squares = JSON.parse(map);
    }else if(myroom.size === "medium"){
    
        const map = JSON.stringify(medium_squares_map);
        play_squares = JSON.parse(map);
    }

    

    canvas2.addEventListener("click", pre_pvp_get_coords);

    room_container.style.display = "none";

    room_inside.style.display = "none";
    
    canvas_container.className = "canvas_container";
    
    players_divs = [];
    
    players_dom_scores = [];
    
    teams_dom_totals = [];
    
    teams_dom_totals_p = [];
    
    player_scores.forEach((player, index)=>{
    
        let flag1 = false;
    
        teams_dom_totals.forEach((team)=>{
        
            if(parseInt(player.team) === team){
            
                flag1 = true;
            }
        })
        
        if(!flag1){
        
            teams_dom_totals.push(parseInt(player.team));
        }
    
        let d = document.createElement("div");
        d.setAttribute("class", "players_div");
    
        let i = document.createElement("img");
        i.setAttribute("src", teams[player.team].img);
        i.setAttribute("class", "players_i");
        
        d.appendChild(i);
    
        let p = document.createElement("p");
        p.setAttribute("class", "players_p");
        p.innerText = player.user_name;
        d.appendChild(p);
        
        let ps = document.createElement("p");
        ps.setAttribute("class", "players_dom_scores");
        ps.innerText = player.score;
        d.appendChild(ps);
        players_dom_scores.push(ps);
        
        players_container.appendChild(d);
        players_divs.push(d);
    })
    
    players_divs.forEach((d, index)=>{
    
        if(myroom.current_turn === index){
        
            d.className = "players_active_div";
        }
    })
    
    let dt = document.createElement("div");
    dt.setAttribute("class", "players_div_bottom");
    
    teams_dom_totals.forEach((team)=>{  
        
        let it = document.createElement("img");
        it.setAttribute("src", teams[team].img);
        it.setAttribute("class", "players_it");
        dt.appendChild(it);
    
        let pt = document.createElement("p");
        pt.setAttribute("class", "teams_dom_scores");
        pt.innerText = 0;
        dt.appendChild(pt); 
        teams_dom_totals_p.push(pt);
    })
    
    players_container.appendChild(dt);
    players_divs.push(dt);
    
    main_ctx = canvas.getContext("2d");
    
    main_ctx2 = canvas2.getContext("2d");
    
    main_ctx2.fillStyle = "LightSeaGreen";

    main_ctx.clearRect(0, 0, canvas.width, canvas.height);

    const back_colors = ["Indigo","MidnightBlue","DarkGreen","DarkRed"];

    main_ctx.fillStyle = back_colors[random_int(0,3)];

	main_ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	main_ctx.fillStyle = "White";
	
	let cont1 = 0;
	
	//GENERATE DOTS MAP
	
	gen_map(myroom.size);
}

function gen_map(opt){

    if(opt === "small"){
    
        small_dots = [];
	
	    for(let c = 0; c < 4; c++){

            for(let b = 0; b < 4; b++){
                
                let dot_ob = {
                    "x":(75 + (b * 210)),
                    "y":(60 + (c * 220)),
                    "ix":b,
                    "iy":c
                }
                
                small_dots.push(dot_ob);
            }         
        }
        
        //GENERATE SQUARES, LINES MAP
        
        small_dots.forEach((dot)=>{
        
           play_squares.forEach((square)=>{
        
                square.lines.forEach((line)=>{
            
                    if(dot.ix === line.iax && dot.iy === line.iay){
                    
                        line.ax = dot.x;
                        line.ay = dot.y;
                    }else if(dot.ix === line.ibx && dot.iy === line.iby){
                    
                        line.bx = dot.x;
                        line.by = dot.y;
                    }
                    
                    if(line.iby > line.iay){
                    
                        line.vertical = true;    
                    }
                })
            })    
        })        
        
        main_ctx.strokeStyle = "LightSeaGreen";
        main_ctx.setLineDash([10, 60]);
        main_ctx.lineWidth = 4;
        
        play_squares.forEach((square)=>{
        
            square.lines.forEach((line)=>{
            
                    main_ctx.beginPath();
                    main_ctx.moveTo(line.ax, line.ay);
                    main_ctx.lineTo(line.bx, line.by);
                    main_ctx.stroke();
            })
        })
        
        main_ctx.strokeStyle = "White";
        main_ctx.setLineDash([]);
        main_ctx.lineWidth = 4;
        
        for(let c = 0; c < 4; c++){

            for(let b = 0; b < 4; b++){

                main_ctx.beginPath();

                main_ctx.arc((75 + (b * 210)), (60 + (c * 220)), 8, 0, 2 * Math.PI);
                
                main_ctx.fill();
            }
        }
	}else if(opt === "medium"){
	
	    medium_dots = [];
	
	    for(let c = 0; c < 8; c++){

            for(let b = 0; b < 8; b++){
                
                let dot_ob = {
                    "x":(37.5 + (b * 105))-20,
                    "y":(30 + (c * 110))-15,
                    "ix":b,
                    "iy":c
                }
                
                medium_dots.push(dot_ob);
            }         
        }
        
        //GENERATE SQUARES, LINES MAP
        
        medium_dots.forEach((dot)=>{
        
           play_squares.forEach((square)=>{
        
                square.lines.forEach((line)=>{
            
                    if(dot.ix === line.iax && dot.iy === line.iay){
                    
                        line.ax = dot.x;
                        line.ay = dot.y;
                    }else if(dot.ix === line.ibx && dot.iy === line.iby){
                    
                        line.bx = dot.x;
                        line.by = dot.y;
                    }
                    
                    if(line.iby > line.iay){
                    
                        line.vertical = true;    
                    }
                })
            })    
        })        
        
        main_ctx.strokeStyle = "LightSeaGreen";
        main_ctx.setLineDash([5, 30]);
        main_ctx.lineWidth = 2;
        
        play_squares.forEach((square)=>{
        
            square.lines.forEach((line)=>{
            
                    main_ctx.beginPath();
                    main_ctx.moveTo(line.ax, line.ay);
                    main_ctx.lineTo(line.bx, line.by);
                    main_ctx.stroke();
            })
        })
        
        main_ctx.strokeStyle = "White";
        main_ctx.setLineDash([]);
        main_ctx.lineWidth = 4;
        
        play_squares.forEach((square, indx)=>{
        
                    if(((indx+1)%7) === 0){
            
                        main_ctx.beginPath();
                        main_ctx.arc(square.lines[0].ax, square.lines[0].ay, 6, 0, 2 * Math.PI);
                        main_ctx.fill();
            
                        main_ctx.beginPath();
                        main_ctx.arc(square.lines[0].bx, square.lines[0].by, 6, 0, 2 * Math.PI);
                        main_ctx.fill();
            
                        main_ctx.beginPath();
                        main_ctx.arc(square.lines[2].ax, square.lines[2].ay, 6, 0, 2 * Math.PI);
                        main_ctx.fill();
            
                        main_ctx.beginPath();
                        main_ctx.arc(square.lines[2].bx, square.lines[2].by, 6, 0, 2 * Math.PI);
                        main_ctx.fill();
                    
                    }else{
            
                        main_ctx.beginPath();
                        main_ctx.arc(square.lines[0].ax, square.lines[0].ay, 6, 0, 2 * Math.PI);
                        main_ctx.fill();
            
                        main_ctx.beginPath();
                        main_ctx.arc(square.lines[0].bx, square.lines[0].by, 6, 0, 2 * Math.PI);
                        main_ctx.fill();
                    
                    }
        })   
	}
}

function animate_square(square){

    main_ctx2.strokeStyle = "Gold";
                
                            const time2a = setTimeout(()=>{
                                
                            let w = 64;
                        
                            const inter2 = setInterval(()=>{
                            
                                main_ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                
                                main_ctx2.lineWidth = w;
                
                                main_ctx2.beginPath();
                
                                main_ctx2.rect(square.lines[0].ax, square.lines[0].ay, square.lines[3].bx-square.lines[3].ax, square.lines[0].by-square.lines[0].ay);
                
                                main_ctx2.stroke(); 
                                
                                w /= 2;
                                
                                if(w <= 2){
                                
                                    main_ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                                
                                    clearInterval(inter2);
                                }      
                            },100);
                        }, 350);
}

function animate_hline(line){
                            
    main_ctx2.fillStyle = "White";         

    let dx = line.ax;
                        
                            let dtime2 = 1;
                            
                            const time2 = setInterval(()=>{
                                main_ctx2.clearRect(0, 0, canvas2.width, canvas2.height);           
                                            
                                main_ctx2.beginPath();
                                            
                                main_ctx2.arc(line.ax, line.ay, (7*dtime2), 0, 2 * Math.PI);
                
                                main_ctx2.fill();
                                
                                dtime2++;
                                
                                if(dtime2 > 4){
                                
                                    clearInterval(time2); 
                                    
                                    main_ctx2.clearRect(0, 0, canvas2.width, canvas2.height);   
                                }
                            }, 50);
                        
                        const time1 = setInterval(()=>{
                        
                                        main_ctx.beginPath();
                                        main_ctx.moveTo(dx, line.ay); 
                                        dx = dx + ((line.bx-line.ax)/(1000/(line.bx-line.ax))) - 1;
                        
                                        if(dx >= line.bx){
                                        
                                            clearInterval(time1);
                                            
                                                let dtime2 = 1;
                            
                                                const time2 = setInterval(()=>{
                        
                                                main_ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                                            
                                                main_ctx2.beginPath();
                                            
                                                main_ctx2.arc(line.bx, line.by, (7*dtime2), 0, 2 * Math.PI);
                
                                                main_ctx2.fill();
                                
                                                dtime2++;
                                
                                                if(dtime2 > 4){
                                
                                                    clearInterval(time2); 
                                    
                                                    main_ctx2.clearRect(0, 0, canvas2.width, canvas2.height);   
                                                }
                                            }, 50);
                                        }
                                        
                                        main_ctx.lineTo(dx, line.by);
                                        main_ctx.stroke();
                                        
                                    },200/(1000/(line.bx-line.ax)));
}

function animate_vline(line){
                            
                            main_ctx2.fillStyle = "White";

                            let dy = line.ay;
                            
                            let dtime2 = 1;
                            
                            const time2 = setInterval(()=>{
                        
                                main_ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                                           
                                main_ctx2.beginPath();
                                            
                                main_ctx2.arc(line.ax, line.ay, (7*dtime2), 0, 2 * Math.PI);
                
                                main_ctx2.fill();
                                
                                dtime2++;
                                
                                if(dtime2 > 4){
                                
                                    clearInterval(time2); 
                                    
                                    main_ctx2.clearRect(0, 0, canvas2.width, canvas2.height);   
                                }
                            }, 50);
                            
                            const time1 = setInterval(()=>{
                        
                                        main_ctx.beginPath();
                                        main_ctx.moveTo(line.ax, dy);    
                                        dy = dy + ((line.by-line.ay)/(1000/(line.by-line.ay))) - 3;
                                        
                                        if(dy >= line.by){
                                        
                                            clearInterval(time1);
                                            
                                            let dtime2 = 1;
                            
                                            const time2 = setInterval(()=>{
                        
                                                main_ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                                            
                                                main_ctx2.beginPath();
                                            
                                                main_ctx2.arc(line.bx, line.by, (7*dtime2), 0, 2 * Math.PI);
                
                                                main_ctx2.fill();
                                
                                                dtime2++;
                                
                                                if(dtime2 > 4){
                                
                                                    clearInterval(time2); 
                                    
                                                    main_ctx2.clearRect(0, 0, canvas2.width, canvas2.height);   
                                                }
                                            }, 50);
                                        }
                                        
                                        main_ctx.lineTo(line.bx, dy);
                                        main_ctx.stroke();
                                    },200/(1000/(line.by-line.ay)));
}
