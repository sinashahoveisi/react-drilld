import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import DrillD from '../src/DrillD';

export default {
  title: 'Example/Simple',
  component: DrillD,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof DrillD>;

const Template: ComponentStory<typeof DrillD> = (args) => <DrillD {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  title: 'sina',
  folders: [{name: 'sina'}]
};
