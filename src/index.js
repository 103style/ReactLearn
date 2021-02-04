import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{ props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		const board = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
		const boardView = board.map((rows, rIndex) => {
			let column = rows.map((c, cIndex) => {
				return this.renderSquare(c);
			});
			return (
				<div className="board-row"  >
					{column}
				</div>
			);
		});

		return (
			<div>
				{boardView}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				postion: '',
			}],
			xIsNext: true,
			stepNumber: 0,
			postion: '',
			sortIncrement: true,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) return;
		squares[i] = this.state.xIsNext ? 'X' : 'Y';
		const nowPostion = i;
		this.setState({
			history: history.concat([{
				squares: squares,
				postion: nowPostion,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		})
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	updateHistorySort() {
		const sort = !this.state.sortIncrement;
		this.setState({
			sortIncrement: sort,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			console.log('move = ' + move)
			let increment = this.state.sortIncrement;
			move = increment ? move : history.length - 1 - move;

			let stepDes = 'Go to move #' + move + ",  postion = " + history[move].postion;

			const desc = move !== 0 ? stepDes : 'Go to game start';

			let curStep = this.state.stepNumber;

			if (move === curStep) {
				return (
					<li key={move}>
						<button onClick={() => this.jumpTo(move)}> <b>{desc}</b></button>
					</li>
				);
			} else {
				return (
					<li key={move}>
						<button onClick={() => this.jumpTo(move)}>{desc}</button>
					</li>
				);
			}

		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			if (this.state.stepNumber === 9) {
				status = "Game end of tie."
			} else {
				status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'Y');
			}

		}

		return (
			<div className="game" >
				<div className="game-board" >
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				< div className="game-info" >
					<div > {status} </div>
					<ol > {moves} </ol>
				</div >

				<button className="game-history-sort" onClick={() => this.updateHistorySort()}>update sort</button>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}