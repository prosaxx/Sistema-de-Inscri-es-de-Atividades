import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: admin.firestore.Firestore;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Configuração do Firebase Admin SDK
    // Para desenvolvimento local, você pode usar um arquivo de credenciais
    // ou configurar as variáveis de ambiente
    
    if (!admin.apps.length) {
      // Para desenvolvimento local, descomente e configure o caminho do arquivo de credenciais
      // const serviceAccount = require('path/to/your/firebase-credentials.json');
      
      admin.initializeApp({
        // credential: admin.credential.cert(serviceAccount),
        // Para desenvolvimento, você pode usar credenciais padrão
        credential: admin.credential.applicationDefault(),
        // Substitua pelo ID do seu projeto Firebase
        projectId: this.configService.get('FIREBASE_PROJECT_ID', 'sesc-inscricoes-dev'),
      });
    }

    this.db = admin.firestore();
    console.log('🔥 Firebase conectado com sucesso!');
  }

  getFirestore(): admin.firestore.Firestore {
    return this.db;
  }

  // Métodos auxiliares para operações comuns
  async create(collection: string, data: any): Promise<string> {
    const docRef = await this.db.collection(collection).add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  async findById(collection: string, id: string): Promise<any> {
    const doc = await this.db.collection(collection).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  async findAll(collection: string): Promise<any[]> {
    const snapshot = await this.db.collection(collection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async update(collection: string, id: string, data: any): Promise<void> {
    await this.db.collection(collection).doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async delete(collection: string, id: string): Promise<void> {
    await this.db.collection(collection).doc(id).delete();
  }

  async findWhere(collection: string, field: string, operator: any, value: any): Promise<any[]> {
    const snapshot = await this.db.collection(collection).where(field, operator, value).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}