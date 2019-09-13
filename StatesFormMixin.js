/**
 * eslint-env es6
 * @polymer
 * @mixinFunction
 * @extends PolymerElement
 * @polymerMixin
 * @param {Object} superClass PolymerElement
 * @return {Object} superClass
 */
const StatesFormMixin = (superClass) =>
  class extends superClass {
    /**
     */
    static get properties() {
      return {
        context: {
          type: Object,
          value: function() {
            return this;
          },
        },

        currentState: {
          type: String,
        },

        currentStep: {
          type: Number,
          value: 1,
        },

        defaultState: {
          type: String,
        },

        hideSteps: {
          type: Boolean,
          value: true,
        },

        previousState: {
          type: String,
        },

        showClose: {
          type: Boolean,
          value: false,
        },

        states: {
          type: Array,
          value: () => {
            return [];
          },
        },

        stockTransferRecord: {
          type: Object,
        },

        totalSteps: {
          type: Number,
          value: 1,
        },
      };
    }

    /**
     */
    static get observers() {
      return ['statesChanged(states)'];
    }

    /**
     */
    connectedCallback() {
      super.connectedCallback();
      this.set('currentState', this.currentState);

      window.addEventListener('change-state', (event) =>
        this.changeFormState(event)
      );

      window.addEventListener('change-step', (event) => this.changeStep(event));

      window.addEventListener('reset-state', (event) => this.resetState(event));
    }

    /**
     */
    disconnectedCallback() {
      super.disconnectedCallback();

      window.removeEventListener('change-state', (event) =>
        this.changeFormState(event)
      );

      window.removeEventListener('change-step', (event) =>
        this.changeStep(event)
      );

      window.removeEventListener('reset-state', (event) =>
        this.resetState(event)
      );
    }

    /**
     * @param {Array} states Form states
     */
    statesChanged(states) {
      if (states.length > 0) {
        this.set('hideSteps', false);
      }
    }

    /**
     * This will need to change when we need movement both ways
     * @param {Event} event Event
     */
    changeStep(event) {
      if (!this.states) return;

      const previousState = event.detail.previousState;
      if (!previousState) return;

      const previousStateIndex = this.states.findIndex((state) => {
        return state.name === previousState;
      });

      this.set('currentStep', event.detail.currentStep);
      if (previousStateIndex >= 0) {
        this.set('currentState', this.states[previousStateIndex].name);
      }
    }

    /**
     * @param {Event} event Event
     */
    changeFormState(event) {
      this.set('currentStep', event.detail.currentStep + 1);
      if (event.detail.previousState) {
        this.set('previousState', event.detail.previousState);
      }

      if (event.detail.nextState) {
        this.set('currentState', event.detail.nextState);
      }
      this.set(
          'showClose',
          this.currentState === this.states[this.currentState]
      );
      this.set('stockTransferRecord', event.detail.sockTransferRecord);
    }

    /**
     * @param {String} currentState Current state
     * @param {String} name Name
     * @return {Boolean} is it visible?
     */
    _computeVisible(currentState, name) {
      return currentState === name;
    }

    /**
     * @param {Event} event Event
     */
    resetState(event) {
      if (!this.defaultState) {
        console.error('Default state is not set, cannot reset');
      }
      this.set('job', event.detail.entity);
      this.set('currentState', this.defaultState);
      this.set('currentStep', 1);
    }
  };

export default StatesFormMixin;
