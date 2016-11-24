'use strict';

module.exports = function (grunt) {

   //Mostra o tempo que foi gasto para executar estas tarefas
   require('time-grunt')(grunt);

   // Carrega todas as terefas Grunt que estão listadas no arquivo package.json automaticamente
   require('load-grunt-tasks')(grunt);

   //É aqui onde as terefas são definidas e configuradas
   grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      // Monitora a pasta em busca de modificações no arquivos e compila em tempo real quando houver alterações
      watch: {
        options: {
          livereload: true
        },
        sass: {
            files: ['source/assets/sass/*/*.{scss,sass}'],
            tasks: ['sass', 'postcss']
        },
        uglify: {
          files: ['source/assets/js/_*.js'],
          tasks: ['uglify']
        },
        includes: {
          files: ['source/*/*.html'],
          tasks: ['includes']
        }
      },

      //Registrando Tarefas do Compass
      sass: {                    // Tarefa
         dist: {
            options: {
               style: 'compressed'
            },
            files: {
               'dist/assets/css/style.css' : 'source/assets/sass/style.scss'
            }
         }
      },

      //Copia os arquivos
      copy: {
        main: {
         files: [
            { expand: true, cwd: 'source/', src: 'assets/img/**', dest: "dist/" },
            //{ expand: true, src: 'assets/fonts/**', dest: "dist/" },
            //{ expand: true, src: 'assets/vendor/**', dest: "dist/" },
            //{ expand: true, cwd: 'source/', src: 'inc/**', dest: "dist/" },
         ],
        }
      },

      postcss: {
         options: {
            map: true, // inline sourcemaps
            processors: [
              require('autoprefixer')(
                 { browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'] }
              ), // add vendor prefixes
            ]
         },
         dist: {
            src: 'dist/assets/css/*.css'
         }
      },

      //Minifica JS
      uglify: {
         vendor: {
            files: {
              'dist/assets/js/vendor.min.js':
               [
                  'source/assets/js/vendor/jquery/jquery.js',
                  'source/assets/js/vendor/bootstrap/bootstrap.js',
               ]
            }
         },
         site: {
            options: {
              sourceMap: true,
              sourceMapName: 'source/assets/js/app.min.js.map'
            },
            files: {
              'dist/assets/js/app.min.js':
               [
                  'source/assets/js/_app.js'
               ]
            }
         }
      },

      // Includes dos HTMLs necessários
      includes: {
        build: {
          cwd: 'source',
          src: [ '*.html', '*.html' ],
          dest: 'dist/',
          options: {
            flatten: true,
            includePath: 'source/parts',
          }
        }
      },
      
      // criar o server
      express: {
        all: {
          options: {
            port: 9000,
            hostname: "0.0.0.0",
            livereload: true,
            bases: ['dist'] // Diretório principal que será executado
          }
        }
      },

      //  Abre o navegador com o server recém criado
      open: {
        all: {
          // Define a url com a porta configurada acima
          path: 'http://localhost:<%= express.all.options.port%>'
        }
      },

      // Roda as tarefas em Parelo
      concurrent: {
         serve: [
            'sass',
            'postcss:dist',
            'uglify',
            'express',
            'open',
            'watch',
         ],
         options: {
            logConcurrentOutput: true
         }
      }

      
   });

   // Registra `grunt serve` como tarefa
   // O que executar se o comando serve for usado?
   grunt.registerTask('serve',
      /*[
        'concurrent:serve'
      ]*/
      [
        'sass',
        'postcss:dist',
        'uglify',
        'copy',
        'includes',
        'express',
        'open',
        'watch'
      ]
   );

   // Registra `grunt build` como tarefa
   //O que executar se o comando build for usado?
   grunt.registerTask('build',
      [
        'sass',
        'postcss:dist',
        'uglify',
        'copy',
        'includes'
      ]
   );

   // Tarefa de compilar SASS / Composer
   grunt.loadNpmTasks('grunt-contrib-sass');

   // Adiciona prefixos ao CSS
   grunt.loadNpmTasks('grunt-postcss');

   //Minifica os arquivos js
   grunt.loadNpmTasks('grunt-contrib-uglify');

   //Copia arquivos
   grunt.loadNpmTasks('grunt-contrib-copy');

   // Registra build como a tarefa principal de fallback
   grunt.registerTask('default', 'build');

   // Responsável por fazer os "includes" do html
   grunt.loadNpmTasks('grunt-includes');

   //Cria um "server" com os arquivos gerados
   grunt.loadNpmTasks('grunt-contrib-connect');
   grunt.loadNpmTasks("grunt-reload");
};
