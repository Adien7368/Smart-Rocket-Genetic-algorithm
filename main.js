var lifespan = 200;
var po;
var count=0;
var target = {x:0,y:100};
function setup(){
	createCanvas(400,400);
	background(51);
	po = new Population();
	target.x = width/2;
	target.y = 100;

}


function draw(){
background(51);
stroke(255);
fill(255);
arc(target.x,target.y,10,10,0,TWO_PI);
po.run();
count++;
if(count==lifespan){
po.evaluate();
po.selection();
//po = new Population();
count=0;	
}

}


function Population(){
	this.rockets = [];
	this.popsize = 100;
	this.matingPool = [];

	for(var i = 0; i < this.popsize; ++i){
		this.rockets[i] = new  Rocket();
	}

	this.evaluate = function(){
		var maxfit = 0;
		for(var i = 0; i < this.popsize; ++i){
			this.rockets[i].calcFitness();
			if(this.rockets[i].fitness > maxfit)
				maxfit = this.rockets[i].fitness;
		}

		for(var i = 0; i < this.popsize; ++i){
			
			this.rockets[i].fitness /= maxfit;;
		}
		
		for(var i = 0; i < this.popsize; ++i){
			var n = this.rockets[i].fitness*50;

			for(var j=0; j < n; ++j){
				this.matingPool.push(this.rockets[i]);
			}
			
		}

	}

	this.selection = function(){
		var newRockets = [];

	for(var i = 0; i < this.rockets.length; ++i){
		var parentA = random(this.matingPool).dna;
		var parentB = random(this.matingPool).dna;
		var  child = parentA.crossover(parentB);
		child.mutation();
		newRockets[i] = new Rocket(child);
	}

	this.rockets = newRockets;

	}

	this.run = function(){
		for(var i = 0; i < this.popsize; ++i){

			this.rockets[i].update();
			this.rockets[i].show();
		} 
	}
}






function DNA(val){
	if(val){
		this.genes = val;	
	}else{
		
		this.genes = [];
		
		for(var i = 0; i < lifespan ;++i ){
			this.genes[i] = p5.Vector.random2D();
			this.genes[i].setMag(0.1 );
		}
	
	}

	this.crossover = function(partner){
		var newgenes = [];
		for(var i = 0; i < this.genes.length; ++i){
			newgenes[i] = (i < this.genes.length/2) ? this.genes[i]:partner.genes[i]; 
		}
		return new DNA(newgenes);
	}
	this.mutation = function(){
		for(var i = 0; i < this.genes; ++i){
			console.log(random(1.00));
			if(random(1.00) < 0.01){
				this.genes[i] = p5.Vector.random2D();
				this.genes[i].setMag(0.1);
			}
		}
	}

}


function Rocket(dna){
	this.pos =  createVector(width/2,height);
	this.vel = createVector();
	this.acc = createVector();
	this.fitness = 0;
	
	if(dna)
	this.dna = dna;
	else
	this.dna = new DNA();
	
	this.applyForce = function(force){
		this.acc.add(force);
	}

	this.update = function(){
		this.applyForce(this.dna.genes[count]);
		if(dist(this.pos.x,this.pos.y,target.x,target.y)<10){
			this.fitness=1;
		}

		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.calcFitness = function(){
		var d = dist(this.pos.x,this.pos.y,target.x,target.y);
		
		if(this.fitness != 1){
			this.fitness = 1/d;
		}
	}

	this.show = function(){
		push();
		stroke(255);
		noFill();
		translate(this.pos.x,this.pos.y);
		rotate(this.vel.heading());
		rectMode(CENTER);
		rect(0,0,20,7);
		pop();
	}
}