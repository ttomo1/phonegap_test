var offset_x
var offset_y
var unit_size;

var stage_width=10;
var stage_height=20;
var stage=[];

var blocks=[
	[	
		[0,0,0,0],
		[2,2,2,2],
		[0,0,0,0],
		[0,0,0,0]],
	[	
		[3,3],
		[3,3]
	],
	[	
		[0,4,4],
		[4,4,0],
		[0,0,0]],
	[	
		[5,5,0],
		[0,5,5],
		[0,0,0]],
	[
		[6,0,0],
		[6,6,6],
		[0,0,0]],
	[
		[0,0,7],
		[7,7,7],
		[0,0,0]],
	[
		[0,8,0],
		[8,8,8],
		[0,0,0]]];
var block_x=0;
var block_y=0
var block=[];

var next=[];

var colors=[
	[0,0,0],
	[255,255,255],
	[0,255,255],
	[255,255,0],
	[127,255,0],
	[255,0,0],
	[0,0,255],
	[255,127,0],
	[255,0,255]];

var frame_interval=30;
var frame=0;

function getPath() {
    var str = location.pathname;
    var i = str.lastIndexOf('/');
    return str.substring(0,i+1);
}



var sound1,sound2;
function preload()
{
    console.log("test");
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    	sound1=new Media(getPath()+'cursor2.mp3')
    	sound2=new Media(getPath()+'decision21.mp3')
    }
}

var scores=[0,40,100,300,1200];
var score=0;
var score_x;
var score_y;
var score_size;

function init_score()
{
	score_x=unit_size;
	score_y=unit_size;
	score_size=unit_size;
}

function draw_score()
{
	fill(255);
	textSize(score_size);
	textAlign(LEFT,TOP);
	text(str(score+'\n'+getPath()),score_x,score_y);
}

var button_name=["LEFT","RIGHT","DOWN","A","B","C","START"];
var button_r=[60,60,60,60,60,60,60];
var button_x=[0,0,0,0,0,0,0];
var button_y=[0,0,0,0,0,0,0];
var button_pressed=[false,false,false,false,false,false,false];

function draw_buttons()
{
	for(var i=0;i<button_name.length;i++)
	{
		if(button_pressed[i])
		{
            console.log('test')
			sound1.play();
			fill(255);
		}
		else
		{
			fill(127);
		}
		ellipse(button_x[i],button_y[i],button_r[i],button_r[i]);
	}
}

function in_circle(x,y,cx,cy,cr)
{
	return (x-cx)*(x-cx)+(y-cy)*(y-cy)<=cr*cr/4;
}

function touchStarted()
{
	for(var j=0;j<touches.length;j++)
	{
		for(var i=0;i<button_name.length;i++)
		{
			if(in_circle(touches[j].x,touches[j].y,button_x[i],button_y[i],button_r[i]))
			{
				button_pressed[i]=true;
				if(button_name[i]=="LEFT"&&can_move(block,block_x-1,block_y))
				{
					block_x--;
				}
				if(button_name[i]=="RIGHT"&&can_move(block,block_x+1,block_y))
				{
					block_x++;
				}
				if(button_name[i]=="DOWN")
				{
					while(can_move(block,block_x,block_y+1))
					{
						block_y++;
					}
					frame=0;
				}
				if(button_name[i]=="A")
				{
					temp=left_rotate();
					if(can_move(temp,block_x,block_y))
					{
						block=temp;
					}
				}
				if(button_name[i]=="B")
				{
					temp=right_rotate();
					if(can_move(temp,block_x,block_y))
					{
						block=temp;
					}
				}
				if(button_name[i]=="C")
				{
					if(can_move(next,block_x,block_y))
					{
						temp=block;
						block=next;
						next=temp;
					}
				}
				if(button_name[i]=="START")
				{
					init_stage();
					init_block();
					score=0;
				}
			}
		}
	}
}

function touchEnded()
{
	for(var i=0;i<button_name.length;i++)
	{
		button_pressed[i]=false;
	}
}

function init_buttons()
{
	button_x[0]=button_r[0]*5/6*1;
	button_y[0]=windowHeight-(button_r[0]*5/6*2);
	button_x[1]=button_r[1]*5/6*3;
	button_y[1]=windowHeight-(button_r[1]*5/6*2);
	button_x[2]=button_r[2]*5/6*2;
	button_y[2]=windowHeight-(button_r[2]*5/6*1);
	button_x[3]=windowWidth-button_r[3]*5/6*3;
	button_y[3]=windowHeight-(button_r[3]*5/6*1);
	button_x[4]=windowWidth-button_r[4]*5/6*1;
	button_y[4]=windowHeight-(button_r[4]*5/6*1);
	button_x[5]=windowWidth-button_r[5]*5/6*2;
	button_y[5]=windowHeight-(button_r[5]*5/6*2);
	button_x[6]=windowWidth-button_r[6]*5/6*1;
	button_y[6]=button_r[6]*5/6*1;
}

function setup()
{
	createCanvas(windowWidth, windowHeight);
	init_stage();
	init_next();
	init_block();
	init_buttons();
	init_score();
	windowResized();
}

function windowResized()
{
	resizeCanvas(windowWidth, windowHeight);
	var window_size
	if(windowWidth<windowHeight)
	{
		window_size=windowWidth;
	}
	else
	{
		window_size=windowHeight;
	}
	unit_size=window_size*0.8/21;
	offset_x=int((windowWidth-stage[0].length*unit_size)/2);
	offset_y=int((windowHeight-stage.length*unit_size)/2);
	init_buttons();
	init_score();
}

function draw()
{
	background(0);
	draw_stage();
	update_block();
	draw_block();
	draw_next();
	draw_buttons();
	draw_score();
	frame++;
}

function init_stage()
{
	stage=new Array(stage_height+1);
	for(var j=0;j<stage.length;j++)
	{
		stage[j]=new Array(stage_width+2);
		if(j!=stage.length-1)
		{
			for(var i=0;i<stage[j].length;i++)
			{
				if(i!=0&&i!=stage[j].length-1)
				{
					stage[j][i]=0;
				}
				else
				{
					stage[j][i]=1;
				}
			}
		}
		else
		{
			for(var i=0;i<stage[j].length;i++)
			{
				stage[j][i]=1;
			}
		}
	}
}

function draw_stage()
{
	for(var j=0;j<stage.length;j++)
	{
		for(var i=0;i<stage[j].length;i++)
		{
			fill(colors[stage[j][i]]);
			rect(offset_x+i*unit_size,offset_y+j*unit_size,unit_size,unit_size);
		}
	}
}

function init_next()
{
	next=Array.from(blocks[int(Math.random()*blocks.length)]);
}

function init_block()
{
	block=Array.from(next);
	block_x=int((stage[0].length-block.length)/2)
	block_y=0
	init_next();
}

function draw_next()
{
	for(var j=0;j<next.length;j++)
	{
		for(var i=0;i<next[j].length;i++)
		{
			if(next[j][i]>0)
			{
				fill(colors[next[j][i]]);
				rect(offset_x+(stage_width+3+i)*unit_size,offset_y+(1+j)*unit_size,unit_size,unit_size);
			}
		}
	}	
}

function draw_block()
{
	y=block_y;
	while(can_move(block,block_x,y+1))
	{
		y++;
	}
	for(var j=0;j<block.length;j++)
	{
		for(var i=0;i<block[j].length;i++)
		{
			if(block[j][i]>0)
			{
				fill(colors[block[j][i]][0],colors[block[j][i]][1],colors[block[j][i]][2],95);
				rect(offset_x+(block_x+i)*unit_size,offset_y+(y+j)*unit_size,unit_size,unit_size);
				fill(colors[block[j][i]]);
				rect(offset_x+(block_x+i)*unit_size,offset_y+(block_y+j)*unit_size,unit_size,unit_size);
			}
		}
	}
}

function can_move(b,x,y)
{
	for(var j=0;j<b.length;j++)
	{
		for(var i=0;i<b[j].length;i++)
		{
			if(b[j][i]>0&&stage[y+j][x+i]>0)
			{
				return false;
			}
		}
	}
	return true;
}

function fix_block()
{
	for(var j=0;j<block.length;j++)
	{
		for(var i=0;i<block[j].length;i++)
		{
			if(block[j][i]>0)
			{
				stage[block_y+j][block_x+i]=block[j][i];
			}
		}
	}
}

function clear_lines()
{
	var n_lines=0;
	for(var j=0;j<block.length;j++)
	{
		if(block_y+j<stage_height)
		{
			var can_clear=true;
			for(var i=0;i<stage_width;i++)
			{
				if(stage[block_y+j][i+1]==0)
				{
					can_clear=false;
					break;
				}
			}
			if(can_clear)
			{
				n_lines++;
				for(var jj=block_y+j;jj>0;jj--)
				{
					for(var i=0;i<stage_width;i++)
					{
						stage[jj][i+1]=stage[jj-1][i+1];
					}
				}
				for(var i=0;i<stage_width;i++)
				{
					stage[0][i+1]=0;
				}
			}
		}
	}
	if(n_lines>0)
	{
		sound2.play({numberOfLoops: 0});
	}
	score+=scores[n_lines];
}

function update_block()
{
	if(frame>=frame_interval)
	{
		frame=0;
		if(can_move(block,block_x,block_y+1))
		{
			block_y++;
		}
		else
		{
			fix_block();
			clear_lines();
			init_block();
		}
	}
}

function left_rotate()
{
	var h=block.length
	var w=block[0].length
	var ret=new Array(w);
	for(var j=0;j<w;j++)
	{
		ret[j]=new Array(h);
		for(var i=0;i<h;i++)
		{
			ret[j][i]=block[h-i-1][j]
		}
	}
	return ret;
}

function right_rotate()
{
	var h=block.length
	var w=block[0].length
	var ret=new Array(w);
	for(var j=0;j<w;j++)
	{
		ret[j]=new Array(h);
		for(var i=0;i<h;i++)
		{
			ret[j][i]=block[i][w-j-1]
		}
	}
	return ret;
}

function keyPressed()
{
	if(keyCode==RIGHT_ARROW&&can_move(block,block_x+1,block_y))
	{
		block_x++;
	}
	if(keyCode==LEFT_ARROW&&can_move(block,block_x-1,block_y))
	{
		block_x--;
	}
	if(keyCode==DOWN_ARROW)
	{
		while(can_move(block,block_x,block_y+1))
		{
			block_y++;
		}
		frame=0;
	}
	if(key=='z')
	{
		temp=left_rotate();
		if(can_move(temp,block_x,block_y))
		{
			block=temp;
		}
	}
	if(key=='x')
	{
		temp=right_rotate();
		if(can_move(temp,block_x,block_y))
		{
			block=temp;
		}
	}
	if(key=='s')
	{
		if(can_move(next,block_x,block_y))
		{
			temp=block
			block=next;
			next=temp;
		}
	}

}

