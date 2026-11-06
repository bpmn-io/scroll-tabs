import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  ignored: [
    'node_modules'
  ],
  build: [
    'karma.conf.js'
  ],
  test: [
    'test.js'
  ]
};

export default [
  {
    ignores: files.ignored
  },

  // source
  ...bpmnIoPlugin.configs.browser.map(config => ({
    ...config,
    ignores: [ ...files.build, ...files.test ]
  })),

  // tests
  ...bpmnIoPlugin.configs.browser.map(config => ({
    ...config,
    files: files.test
  })),
  ...bpmnIoPlugin.configs.mocha.map(config => ({
    ...config,
    files: files.test
  })),

  // build
  ...bpmnIoPlugin.configs.node.map(config => ({
    ...config,
    files: files.build,
    languageOptions: {
      ...config.languageOptions,
      sourceType: 'commonjs'
    }
  }))
];
