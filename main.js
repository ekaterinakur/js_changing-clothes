'use strict';

const container = document.querySelector('.changing-clothes');

let initialState = {
    items: ['Apron', 'Belt', 'Cardigan', 'Dress', 'Earrings', 'Fur coat', 'Gloves', 'Hat'],
		index: null,
		inputText: null
};

const clickEdit = inputText => {
	return {
		type: 'click_edit',
	  inputText
	}
};

const clickEnter = inputText => {
	return {
		type: 'click_enter',
		inputText
	}
};

const removeItem = () => {
	return {
		type: 'remove_item'
	}
};

const exitFromInput = () => {
	return {
		type: 'exit_from_input'
	}
};

function getNextState(state = initialState, action) {
	switch (action.type) {
		case 'click_edit':
			return {
				...state,
				index: state.items.indexOf(action.inputText),
		    inputText: action.inputText
			};
		case 'click_enter':
			return {
				...state,
				items: state.items.map(item => {
					if (state.items.indexOf(item) === state.index) {
						return action.inputText;
					}
					return item;
				}),
				inputText: ''
			};
		case 'remove_item':
			return {
				...state,
				items: state.items.filter(item => {
					return state.items.indexOf(item) !== state.index;
				}),
				index: null,
				inputText: ''
			}
		case 'exit_from_input':
				return {
					...state,
					index: null,
					inputText: null
				}
		default:
			return state;
	}
}

const store = Redux.createStore(getNextState);

container.addEventListener('click', (event) => {
	if (!event.target.closest('button') && !event.target.closest('input')) {
		store.dispatch(exitFromInput());
	}
})

function render() {
	container.innerHTML = '';

	store.getState().items.forEach(item => {
		const li = document.createElement('li');
		li.textContent = item;
		
		if (store.getState().inputText !== item) {
			const button = document.createElement('button');
			button.textContent = 'Edit';
			li.append(button);

	    button.addEventListener('click', () => {
			  store.dispatch(clickEdit(item));
			});
		} else {
			const input = document.createElement('input');
			input.value = item;
			input.setAttribute('autofocus', 'autofocus');
			li.append(input);

			input.addEventListener('keydown', event => {
			  if (event.key !== 'Enter') {
				  return;
				};
				if (event.target.value.trim() === '') {
					store.dispatch(removeItem());
				}

				store.dispatch(clickEnter(event.target.value.trim()));
			});
		}
		
		container.append(li);
	});
}

store.subscribe(() => {
	render();
});

render();
