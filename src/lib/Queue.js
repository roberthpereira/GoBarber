import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

// estamos pegando todos os jobs da nossa app e armazenando em this.queues
class Queue {
  constructor() {
    // Cada serviço/jobs tera sua propria fila
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        // metodo q vai processar o nosso job
        handle,
      };
    });
  }

  // metodo pra add novos trabalhos/jobs em nossa fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // metodo pra processar filas
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
